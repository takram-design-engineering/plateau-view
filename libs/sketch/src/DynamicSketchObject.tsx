import { Color } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { type LineString, type MultiPolygon, type Polygon } from 'geojson'
import { useAtomValue, type Atom } from 'jotai'
import { memo, useMemo, type FC } from 'react'

import {
  convertGeometryToPositionsArray,
  convertPolygonToHierarchyArray
} from '@takram/plateau-cesium-helpers'

import {
  ExtrudedPolygonEntity,
  type ExtrudedPolygonEntityProps
} from './ExtrudedPolygonEntity'
import { PolygonEntity } from './PolygonEntity'
import { PolylineEntity } from './PolylineEntity'

export interface DynamicSketchObjectProps {
  geometryAtom: Atom<LineString | Polygon | MultiPolygon | null>
  extrudedHeight?: ExtrudedPolygonEntityProps['extrudedHeight']
  disableShadow?: ExtrudedPolygonEntityProps['disableShadow']
  color?: Color
}

export const DynamicSketchObject: FC<DynamicSketchObjectProps> = memo(
  ({ geometryAtom, extrudedHeight, disableShadow, color }) => {
    const geometry = useAtomValue(geometryAtom)

    let positionsArray
    let hierarchyArray
    if (geometry?.type === 'LineString') {
      positionsArray = convertGeometryToPositionsArray(geometry)
    } else if (geometry != null) {
      positionsArray = convertGeometryToPositionsArray(geometry)
      hierarchyArray = convertPolygonToHierarchyArray(geometry)
    }

    const theme = useTheme()
    const primaryColor = useMemo(
      () => Color.fromCssColorString(theme.palette.primary.main),
      [theme]
    )

    return (
      <>
        {positionsArray?.map((positions, index) => (
          <PolylineEntity
            key={index}
            dynamic
            positions={positions}
            color={color ?? primaryColor}
          />
        ))}
        {hierarchyArray?.map((hierarchy, index) => (
          <PolygonEntity
            key={index}
            dynamic
            hierarchy={hierarchy}
            color={color ?? primaryColor}
          />
        ))}
        {extrudedHeight != null &&
          hierarchyArray?.map((hierarchy, index) => (
            <ExtrudedPolygonEntity
              key={index}
              dynamic
              hierarchy={hierarchy}
              extrudedHeight={extrudedHeight}
              disableShadow={disableShadow}
              color={color ?? primaryColor}
            />
          ))}
      </>
    )
  }
)
