import {
  Cartesian3,
  Cartographic,
  Color,
  HeightReference,
  HorizontalOrigin,
  LabelStyle,
  NearFarScalar,
  Rectangle,
  VerticalOrigin,
  type Ellipsoid,
  type Label
} from '@cesium/engine'
import { merge, omit } from 'lodash'
import { type Feature } from 'protomaps'
import { memo, useCallback, useEffect, useMemo, useRef, type FC } from 'react'
import { suspend } from 'suspend-react'

import { useCesium } from '@takram/plateau-cesium'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { getAnnotationType, type AnnotationType } from './getAnnotationType'
import { getTileCoords } from './helpers'
import { type LabelImageryProvider } from './LabelImageryProvider'
import { type Imagery, type KeyedImagery } from './types'

type LabelOptions = Partial<
  Pick<
    Label,
    {
      [K in keyof Label]: Label[K] extends (...args: any[]) => any ? never : K
    }[keyof Label]
  >
>

export type AnnotationStyle = Partial<
  Record<
    AnnotationType | 'default',
    | (Omit<LabelOptions, 'id' | 'position' | 'text' | 'font' | 'show'> & {
        fontSize?: number
        fontFamily?: string
      })
    | false
  >
>

const fontScale = 5
const scaleByDistance = new NearFarScalar(
  0,
  1 / fontScale,
  Number.POSITIVE_INFINITY,
  1 / fontScale
)

const defaultStyle: AnnotationStyle = {
  default: {
    fontFamily: 'sans-serif',
    fillColor: Color.BLACK,
    outlineColor: Color.WHITE.withAlpha(0.8),
    outlineWidth: 5
  },
  municipalities: {
    fontSize: 12
  },
  towns: {
    fontSize: 8,
    fillColor: Color.BLACK.withAlpha(0.6),
    outlineColor: Color.WHITE.withAlpha(0.4)
  },
  roads: {
    fontSize: 8
  },
  railways: {
    fontSize: 8
  },
  stations: {
    fontSize: 9
  },
  landmarks: {
    fontSize: 8
  },
  topography: {
    fontSize: 8,
    fillColor: Color.BLACK.withAlpha(0.6),
    outlineColor: Color.WHITE.withAlpha(0.4)
  }
}

function resolveStyle(
  code: number,
  style?: AnnotationStyle
): Partial<LabelOptions> | undefined {
  const type = getAnnotationType(code)
  if (type == null) {
    return
  }
  const typeStyle = style?.[type]
  if (typeStyle === false) {
    return
  }
  const mergedStyle = merge(
    {},
    defaultStyle.default,
    defaultStyle[type],
    typeStyle
  )
  return {
    scaleByDistance,
    ...omit(mergedStyle, ['fontSize', 'fontFamily']),
    font:
      mergedStyle?.fontSize != null && mergedStyle.fontFamily != null
        ? `${mergedStyle.fontSize * fontScale}pt ${mergedStyle.fontFamily}`
        : undefined
  }
}

interface AnnotationFeature extends Feature {
  props: {
    vt_code: number
    vt_text: string
    vt_arrng?: number
    vt_arrngagl?: number
  }
}

const positionScratch = new Cartesian3()
const cartographicScratch = new Cartographic()

function getPosition(
  feature: Feature,
  bounds: Rectangle,
  descendantsBounds: Rectangle[] | undefined,
  tileSize: number,
  height?: number,
  ellipsoid?: Ellipsoid,
  result = new Cartesian3()
): Cartesian3 | undefined {
  const x = feature.geom[0][0].x / tileSize
  const y = feature.geom[0][0].y / tileSize
  if (x < 0 || x > 1 || y < 0 || y > 1) {
    return
  }
  const cartographic = Cartographic.fromRadians(
    bounds.west + bounds.width * x,
    bounds.south + bounds.height * (1 - y),
    height,
    cartographicScratch
  )
  if (
    descendantsBounds?.some(bounds =>
      Rectangle.contains(bounds, cartographic)
    ) === true
  ) {
    return
  }
  return Cartographic.toCartesian(cartographic, ellipsoid, result)
}

export interface LabelImageryProps {
  imageryProvider: LabelImageryProvider
  imagery: KeyedImagery
  descendants?: readonly Imagery[]
  height?: number
  style?: AnnotationStyle
}

export const LabelImagery: FC<LabelImageryProps> = memo(
  ({
    imageryProvider,
    imagery,
    descendants,
    height = 50,
    style = defaultStyle
  }) => {
    const tile = suspend(
      async () => await imageryProvider.tileCache.get(getTileCoords(imagery)),
      [LabelImagery, imagery.key]
    )

    const bounds = useMemo(
      () =>
        imageryProvider.tilingScheme.tileXYToRectangle(
          imagery.x,
          imagery.y,
          imagery.level
        ),
      [imageryProvider, imagery]
    )

    const descendantsBounds = useMemo(
      () =>
        descendants?.map(descendant =>
          imageryProvider.tilingScheme.tileXYToRectangle(
            descendant.x,
            descendant.y,
            descendant.level
          )
        ),
      [imageryProvider, descendants]
    )

    const annotations = useMemo(() => {
      const features = tile.get('Anno')
      if (features == null) {
        return []
      }
      return features.filter(
        (feature): feature is AnnotationFeature =>
          typeof feature.props.vt_code === 'number' &&
          // Look for annotations with 3-digits code only.
          // https://maps.gsi.go.jp/help/pdf/vector/optbv_featurecodes.pdf
          `${feature.props.vt_code}`.length === 3 &&
          typeof feature.props.vt_text === 'string' &&
          (feature.props.vt_arrng == null ||
            typeof feature.props.vt_arrng === 'number') &&
          (feature.props.vt_arrngagl == null ||
            typeof feature.props.vt_arrngagl === 'number') &&
          // `vt_flag17` property determines the visibility of features inside
          // tiles at level 16.
          // https://maps.gsi.go.jp/help/pdf/vector/optbv_attribute.pdf
          (imagery.level < 16 ||
            (imagery.level === 16 && feature.props.vt_flag17 !== 2) ||
            (imagery.level === 17 && feature.props.vr_flag17 !== 0))
      )
    }, [tile, imagery])

    const labelsRef = useRef<Array<[AnnotationFeature, Label]>>()
    const scene = useCesium(({ scene }) => scene)

    const updateVisibility = useCallback(() => {
      const labels = labelsRef.current
      if (labels == null) {
        return
      }
      labels.forEach(([feature, label]) => {
        const position = getPosition(
          feature,
          bounds,
          descendantsBounds,
          imageryProvider.tileCache.tileSize,
          height,
          scene.globe.ellipsoid,
          positionScratch
        )
        if (position != null) {
          label.position = position
          label.show = true
        } else {
          label.show = false
        }
      })
      scene.requestRender()
    }, [imageryProvider, height, bounds, descendantsBounds, scene])

    const labelCollection = useCesium(({ labels }) => labels)
    const updateVisibilityRef = useRef(updateVisibility)
    updateVisibilityRef.current = updateVisibility

    useEffect(() => {
      const labels = annotations
        .map((feature): [AnnotationFeature, Label] | undefined => {
          const styleOptions = resolveStyle(feature.props.vt_code, style)
          if (styleOptions == null) {
            return undefined
          }
          const options: LabelOptions = {
            text: feature.props.vt_text,
            style: LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Infinity,
            ...styleOptions
          }
          return [feature, labelCollection.add(options)]
        })
        .filter(isNotNullish)

      labelsRef.current = labels
      updateVisibilityRef.current()

      const removeLabels = (): void => {
        if (!labelCollection.isDestroyed()) {
          labels.forEach(([, label]) => {
            labelCollection.remove(label)
          })
        }
        if (!scene.isDestroyed()) {
          scene.postRender.removeEventListener(removeLabels)
        }
      }
      return () => {
        labelsRef.current = undefined
        if (!scene.isDestroyed()) {
          scene.postRender.addEventListener(removeLabels)
        }
      }
    }, [style, annotations, scene, labelCollection])

    useEffect(() => {
      updateVisibility()
    }, [updateVisibility])

    return null
  }
)
