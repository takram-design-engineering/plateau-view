import { Cartesian3 } from '@cesium/engine'
import {
  type LineString,
  type MultiPolygon,
  type Polygon,
  type Position
} from 'geojson'

function coordinatesToPositionsArray(
  coordinates: readonly Position[][]
): Cartesian3[][] {
  return coordinates.map(coordinates =>
    coordinates.map(([x, y]) => Cartesian3.fromDegrees(x, y, 0))
  )
}

export function convertGeometryToPositionsArray(
  geometry: LineString | Polygon | MultiPolygon
): Cartesian3[][] {
  return (
    geometry.type === 'LineString'
      ? coordinatesToPositionsArray([geometry.coordinates])
      : geometry.type === 'Polygon'
      ? coordinatesToPositionsArray(geometry.coordinates)
      : geometry.coordinates.flatMap(coordinates =>
          coordinatesToPositionsArray(coordinates)
        )
  ).filter(({ length }) => length > 0)
}
