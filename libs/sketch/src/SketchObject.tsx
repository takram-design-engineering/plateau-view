import { type Color } from '@cesium/engine'
import { type MultiPolygon, type Polygon } from 'geojson'
import { useMemo, type FC } from 'react'

import { convertPolygonToHierarchyArray } from '@takram/plateau-cesium-helpers'

import {
  ExtrudedPolygonEntity,
  type ExtrudedPolygonEntityProps
} from './ExtrudedPolygonEntity'

export interface SketchObjectProps {
  geometry: Polygon | MultiPolygon
  extrudedHeight: number
  disableShadow?: ExtrudedPolygonEntityProps['disableShadow']
  color?: Color
}

export const SketchObject: FC<SketchObjectProps> = ({
  geometry,
  extrudedHeight,
  disableShadow,
  color
}) => {
  const hierarchyArray = useMemo(
    () => convertPolygonToHierarchyArray(geometry),
    [geometry]
  )

  return hierarchyArray?.map((hierarchy, index) => (
    <ExtrudedPolygonEntity
      key={index}
      hierarchy={hierarchy}
      extrudedHeight={extrudedHeight}
      disableShadow={disableShadow}
      color={color}
    />
  ))
}
