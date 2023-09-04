import { Color, type Property } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { type LineString, type MultiPolygon, type Polygon } from 'geojson'
import { atom, useAtomValue, type Atom } from 'jotai'
import { memo, useMemo, type FC } from 'react'
import { type RequireExactlyOne } from 'type-fest'

import {
  convertGeometryToPositionsArray,
  convertPolygonToHierarchyArray
} from '@takram/plateau-cesium-helpers'

import { createGeometry, type GeometryOptions } from './createGeometry'
import {
  ExtrudedPolygonEntity,
  type ExtrudedPolygonEntityProps
} from './ExtrudedPolygonEntity'
import { PolygonEntity } from './PolygonEntity'
import { PolylineEntity } from './PolylineEntity'
import { SurfaceControlPoints } from './SurfaceControlPoints'

export type DynamicSketchObjectProps = RequireExactlyOne<
  {
    geometryAtom?: Atom<LineString | Polygon | MultiPolygon | null>
    geometryOptionsAtom?: Atom<GeometryOptions | null>
    extrudedHeight?: Property
    disableShadow?: ExtrudedPolygonEntityProps['disableShadow']
    color?: Color
  },
  'geometryAtom' | 'geometryOptionsAtom'
>

export const DynamicSketchObject: FC<DynamicSketchObjectProps> = memo(
  ({
    geometryAtom,
    geometryOptionsAtom,
    extrudedHeight,
    disableShadow,
    color
  }) => {
    const geometry = useAtomValue(
      useMemo(
        () =>
          atom(get => {
            if (geometryAtom != null) {
              return get(geometryAtom)
            }
            const geometryOptions = get(geometryOptionsAtom)
            return geometryOptions != null
              ? createGeometry(geometryOptions)
              : null
          }),
        [geometryAtom, geometryOptionsAtom]
      )
    )
    const geometryOptions = useAtomValue(
      useMemo(
        () =>
          atom(get =>
            geometryOptionsAtom != null ? get(geometryOptionsAtom) : null
          ),
        [geometryOptionsAtom]
      )
    )

    const [positionsArray, hierarchyArray] = useMemo(() => {
      if (geometry?.type === 'LineString') {
        return [convertGeometryToPositionsArray(geometry), undefined]
      } else if (geometry != null) {
        return [
          convertGeometryToPositionsArray(geometry),
          convertPolygonToHierarchyArray(geometry)
        ]
      }
      return []
    }, [geometry])

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
        {geometryOptions != null && extrudedHeight == null && (
          <SurfaceControlPoints
            geometryOptions={geometryOptions}
            color={color ?? primaryColor}
          />
        )}
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
