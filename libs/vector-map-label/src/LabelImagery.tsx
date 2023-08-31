import {
  Cartesian3,
  Cartographic,
  Color,
  HeightReference,
  HorizontalOrigin,
  LabelStyle,
  Rectangle,
  VerticalOrigin,
  type Ellipsoid,
  type Label
} from '@cesium/engine'
import { type Feature } from 'protomaps'
import { memo, useCallback, useEffect, useMemo, useRef, type FC } from 'react'
import { suspend } from 'suspend-react'

import { useCesium } from '@takram/plateau-cesium'
import { isNotNullish } from '@takram/plateau-type-helpers'

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

export type LabelStyleOptions = Omit<LabelOptions, 'id' | 'position' | 'show'>

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
}

export const LabelImagery: FC<LabelImageryProps> = memo(
  ({ imageryProvider, imagery, descendants, height = 50 }) => {
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
          // https://www.gsi.go.jp/common/000218028.pdf
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
        .map((feature): [AnnotationFeature, Label] => {
          // TODO: Change color by the global color mode.
          const options: LabelOptions = {
            text: feature.props.vt_text,
            font: '10pt sans-serif',
            style: LabelStyle.FILL_AND_OUTLINE,
            fillColor: Color.BLACK,
            outlineColor: Color.WHITE.withAlpha(0.8),
            outlineWidth: 5,
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
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
    }, [annotations, scene, labelCollection])

    useEffect(() => {
      updateVisibility()
    }, [updateVisibility])

    return null
  }
)
