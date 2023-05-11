import { Cartesian3 } from '@cesium/engine'
import { type MultiPolygon, type Polygon, type Position } from 'geojson'

function coordinatesToPositionsArray(
  coordinates: readonly Position[][]
): Cartesian3[][] {
  return coordinates.map(coordinates =>
    coordinates.map(([x, y]) => Cartesian3.fromDegrees(x, y, 0))
  )
}

export function convertPolygonToPositionsArray(
  polygon: Polygon | MultiPolygon
): Cartesian3[][] {
  return (
    polygon.type === 'Polygon'
      ? coordinatesToPositionsArray(polygon.coordinates)
      : polygon.coordinates.flatMap(coordinates =>
          coordinatesToPositionsArray(coordinates)
        )
  ).filter(({ length }) => length > 0)
}
