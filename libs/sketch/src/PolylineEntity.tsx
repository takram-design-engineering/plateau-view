import {
  ClassificationType,
  Color,
  ColorMaterialProperty
} from '@cesium/engine'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { useEffect, useMemo, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { convertPolygonToPositionsArray } from '@takram/plateau-cesium-helpers'

export interface PolylineEntityProps {
  feature: Feature<Polygon | MultiPolygon>
  color?: string
  alpha?: number
}

export const PolylineEntity: FC<PolylineEntityProps> = ({
  feature,
  color = '#808080',
  alpha = 0.5
}) => {
  const positionsArray = useMemo(
    () => convertPolygonToPositionsArray(feature.geometry),
    [feature]
  )

  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    scene.requestRender()
  })
  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  const polylines = useMemo(() => {
    const material = new ColorMaterialProperty(
      Color.fromCssColorString(color).withAlpha(alpha)
    )
    return positionsArray.map(
      (positions, index): EntityProps => ({
        ...(feature.id != null && {
          id: `PolylineEntity:${feature.id}:${index}`
        }),
        polyline: {
          positions,
          width: 2,
          material,
          classificationType: ClassificationType.TERRAIN,
          clampToGround: true
        }
      })
    )
  }, [feature.id, color, alpha, positionsArray])

  return (
    <>
      {polylines.map((props, index) => (
        <Entity key={index} {...props} />
      ))}
    </>
  )
}
