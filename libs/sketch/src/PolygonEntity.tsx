import {
  ClassificationType,
  Color,
  ColorMaterialProperty
} from '@cesium/engine'
import { type Feature, type MultiPolygon, type Polygon } from 'geojson'
import { useEffect, useMemo, type FC } from 'react'

import { Entity, useCesium, type EntityProps } from '@takram/plateau-cesium'
import { convertPolygonToHierarchyArray } from '@takram/plateau-cesium-helpers'

export interface PolygonEntityProps {
  feature: Feature<Polygon | MultiPolygon>
  color?: string
  alpha?: number
}

export const PolygonEntity: FC<PolygonEntityProps> = ({
  feature,
  color = '#808080',
  alpha = 0.5
}) => {
  const hierarchyArray = useMemo(
    () => convertPolygonToHierarchyArray(feature.geometry),
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

  const polygons = useMemo(() => {
    const material = new ColorMaterialProperty(
      Color.fromCssColorString(color).withAlpha(alpha)
    )
    return hierarchyArray.map(
      (hierarchy, index): EntityProps => ({
        ...(feature.id != null && {
          id: `${PolygonEntity}:${feature.id}:${index}`
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
