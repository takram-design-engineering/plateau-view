import {
  ClassificationType,
  Color,
  ColorMaterialProperty
} from '@cesium/engine'
import { useEffect, useMemo, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import {
  compose,
  convertGeometryToPositionsArray
} from '@takram/plateau-cesium-helpers'

import { type GeometryFeature } from './types'

export interface PolylineEntityProps {
  feature: GeometryFeature
  color?: Color
  alpha?: number
}

export const PolylineEntity: FC<PolylineEntityProps> = ({
  feature,
  color = Color.GRAY,
  alpha = 0.5
}) => {
  const positionsArray = useMemo(
    () => convertGeometryToPositionsArray(feature.geometry),
    [feature]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  const polylines = useMemo(() => {
    const material = new ColorMaterialProperty(color.withAlpha(alpha))
    return positionsArray.map(
      (positions, index): EntityProps => ({
        ...(feature.id != null && {
          id: compose({ type: 'PolylineEntity', key: feature.id, index })
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
