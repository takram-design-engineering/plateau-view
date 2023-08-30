import {
  ClassificationType,
  Color,
  ColorMaterialProperty
} from '@cesium/engine'
import { useEffect, useMemo, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import {
  compose,
  convertPolygonToHierarchyArray
} from '@takram/plateau-cesium-helpers'

import { type GeometryFeature } from './types'

export interface PolygonEntityProps {
  feature: GeometryFeature
  color?: Color
  alpha?: number
}

export const PolygonEntity: FC<PolygonEntityProps> = ({
  feature,
  color = Color.GRAY,
  alpha = 0.5
}) => {
  const hierarchyArray = useMemo(
    () => convertPolygonToHierarchyArray(feature.geometry),
    [feature]
  )

  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  useEffect(() => {
    return () => {
      scene.requestRender()
    }
  }, [scene])

  const polygons = useMemo(() => {
    const material = new ColorMaterialProperty(color.withAlpha(alpha))
    return hierarchyArray.map(
      (hierarchy, index): EntityProps => ({
        ...(feature.id != null && {
          id: compose({ type: 'PolygonEntity', key: feature.id, index })
        }),
        polygon: {
          hierarchy,
          fill: true,
          material,
          classificationType: ClassificationType.TERRAIN
        }
      })
    )
  }, [feature.id, color, alpha, hierarchyArray])

  return (
    <>
      {polygons.map((props, index) => (
        <Entity key={index} {...props} />
      ))}
    </>
  )
}
