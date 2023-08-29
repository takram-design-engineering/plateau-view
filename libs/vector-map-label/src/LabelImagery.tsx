import {
  Cartesian3,
  Color,
  HorizontalOrigin,
  LabelStyle,
  VerticalOrigin,
  type Ellipsoid,
  type Label,
  type Rectangle
} from '@cesium/engine'
import { type Feature } from 'protomaps'
import { memo, useEffect, useMemo, type FC } from 'react'
import { suspend } from 'suspend-react'

import { useCesium } from '@takram/plateau-cesium'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { type LabelImageryProvider } from './LabelImageryProvider'
import { type KeyedImagery } from './types'

type LabelOptions = Partial<
  Pick<
    Label,
    {
      [K in keyof Label]: Label[K] extends (...args: any[]) => any ? never : K
    }[keyof Label]
  >
>

interface AnnotationFeature extends Feature {
  props: {
    vt_code: number
    vt_text: string
    vt_arrng?: number
    vt_arrngagl?: number
  }
}

const positionScratch = new Cartesian3()

function testIntersection(
  bounds: Rectangle,
  x: number,
  y: number,
  descendantBounds: Rectangle
): boolean {
  const featureX = bounds.west + bounds.width * x
  const featureY = bounds.south + bounds.height * (1 - y)
  return (
    descendantBounds.west <= featureX &&
    descendantBounds.east >= featureX &&
    descendantBounds.south <= featureY &&
    descendantBounds.north >= featureY
  )
}

function getPosition(
  feature: Feature,
  bounds: Rectangle,
  descendantsBounds: Rectangle[],
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
  if (
    descendantsBounds.some(descendantBounds =>
      testIntersection(bounds, x, y, descendantBounds)
    )
  ) {
    return
  }

  return Cartesian3.fromRadians(
    bounds.west + bounds.width * x,
    bounds.south + bounds.height * (1 - y),
    height,
    ellipsoid,
    result
  )
}

export interface LabelImageryProps {
  imageryProvider: LabelImageryProvider
  imagery: KeyedImagery
  height?: number
}

export const LabelImagery: FC<LabelImageryProps> = memo(
  ({ imageryProvider, imagery, height = 50 }) => {
    const tile = suspend(
      async () =>
        await imageryProvider.tileCache.get({
          x: imagery.x,
          y: imagery.y,
          z: imagery.level
        }),
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
        imagery.descendants.map(descendant =>
          imageryProvider.tilingScheme.tileXYToRectangle(
            descendant.x,
            descendant.y,
            descendant.level
          )
        ),
      [imageryProvider, imagery]
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
            typeof feature.props.vt_arrngagl === 'number')
      )
    }, [tile])

    const scene = useCesium(({ scene }) => scene)
    const labelCollection = useCesium(({ labels }) => labels)

    useEffect(() => {
      const labels = annotations
        .map(feature => {
          const position = getPosition(
            feature,
            bounds,
            descendantsBounds,
            imageryProvider.tileCache.tileSize,
            height,
            scene.globe.ellipsoid,
            positionScratch
          )
          if (position == null) {
            return undefined
          }
          const options: LabelOptions = {
            position,
            text: feature.props.vt_text,
            font: '10pt sans-serif',
            style: LabelStyle.FILL_AND_OUTLINE,
            fillColor: Color.BLACK,
            outlineColor: Color.WHITE.withAlpha(0.8),
            outlineWidth: 5,
            horizontalOrigin: HorizontalOrigin.CENTER,
            verticalOrigin: VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
          return labelCollection.add(options)
        })
        .filter(isNotNullish)

      const removeLabels = (): void => {
        if (!labelCollection.isDestroyed()) {
          labels.forEach(label => {
            labelCollection.remove(label)
          })
        }
        if (!scene.isDestroyed()) {
          scene.postRender.removeEventListener(removeLabels)
        }
      }
      return () => {
        if (!scene.isDestroyed()) {
          scene.postRender.addEventListener(removeLabels)
        }
      }
    }, [
      imageryProvider,
      height,
      bounds,
      descendantsBounds,
      annotations,
      scene,
      labelCollection
    ])

    return null
  }
)
