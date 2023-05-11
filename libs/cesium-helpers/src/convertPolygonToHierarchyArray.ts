import { Cartesian3, type PolygonHierarchy } from '@cesium/engine'
import { type MultiPolygon, type Polygon, type Position } from 'geojson'

import { isNotNullish } from '@plateau/type-helpers'

function coordinatesToHierarchy(
  coordinates: readonly Position[][]
): PolygonHierarchy | undefined {
  return coordinates.length > 0
    ? {
        positions: coordinates[0].map(([x, y]) =>
          Cartesian3.fromDegrees(x, y, 0)
        ),
        holes: coordinates.slice(1).map(coordinates => ({
          positions: coordinates.map(([x, y]) =>
            Cartesian3.fromDegrees(x, y, 0)
          ),
          holes: []
        }))
      }
    : undefined
}

export function convertPolygonToHierarchyArray(
  polygon: Polygon | MultiPolygon
): PolygonHierarchy[] {
  return (
    polygon.type === 'Polygon'
      ? [coordinatesToHierarchy(polygon.coordinates)]
      : polygon.coordinates.map(coordinates =>
          coordinatesToHierarchy(coordinates)
        )
  ).filter(isNotNullish)
}
