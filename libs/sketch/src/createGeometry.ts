import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  type Ellipsoid
} from '@cesium/engine'
import { ellipse, lineString, polygon } from '@turf/turf'
import { type LineString, type MultiPolygon, type Polygon } from 'geojson'

import { type SketchGeometryType } from './types'

const cartographicScratch = new Cartographic()
const cartesianScratch1 = new Cartesian3()
const cartesianScratch2 = new Cartesian3()

function createCircle(
  positions: readonly Cartesian3[],
  ellipsoid?: Ellipsoid
): Polygon | undefined {
  if (positions.length !== 2) {
    return
  }
  const radius = Cartesian3.distance(positions[0], positions[1])
  if (radius === 0) {
    return
  }
  try {
    const cartographic = Cartographic.fromCartesian(
      positions[0],
      ellipsoid,
      cartographicScratch
    )
    const feature = ellipse(
      [
        CesiumMath.toDegrees(cartographic.longitude),
        CesiumMath.toDegrees(cartographic.latitude)
      ],
      radius,
      radius,
      { units: 'meters' }
    )
    return feature.geometry
  } catch (error) {
    console.error(error)
  }
}

function createRectangle(
  positions: readonly Cartesian3[],
  ellipsoid?: Ellipsoid
): LineString | Polygon | undefined {
  if (positions.length !== 2 && positions.length !== 3) {
    return
  }
  try {
    if (positions.length === 2) {
      const feature = lineString(
        positions.map(position => {
          const cartographic = Cartographic.fromCartesian(
            position,
            ellipsoid,
            cartographicScratch
          )
          return [
            CesiumMath.toDegrees(cartographic.longitude),
            CesiumMath.toDegrees(cartographic.latitude)
          ]
        })
      )
      return feature.geometry
    }

    // Rectangle from 3 points.
    const [p1, p2, p3] = positions
    const projection = Cartesian3.projectVector(
      Cartesian3.subtract(p3, p1, cartesianScratch1),
      Cartesian3.subtract(p2, p1, cartesianScratch2),
      cartesianScratch1
    )
    const offset = Cartesian3.subtract(
      p3,
      Cartesian3.add(p1, projection, cartesianScratch1),
      cartesianScratch2
    )
    const p4 = Cartesian3.add(p1, offset, cartesianScratch1)
    const p5 = Cartesian3.add(p2, offset, cartesianScratch2)
    const feature = polygon([
      [p1, p2, p5, p4, p1].map(position => {
        const cartographic = Cartographic.fromCartesian(
          position,
          ellipsoid,
          cartographicScratch
        )
        return [
          CesiumMath.toDegrees(cartographic.longitude),
          CesiumMath.toDegrees(cartographic.latitude)
        ]
      })
    ])
    return feature.geometry
  } catch (error) {
    console.error(error)
  }
}

function createPolygon(
  positions: readonly Cartesian3[],
  ellipsoid?: Ellipsoid
): LineString | Polygon | undefined {
  if (positions.length < 2) {
    return
  }
  try {
    if (positions.length === 2) {
      const feature = lineString(
        positions.map(position => {
          const cartographic = Cartographic.fromCartesian(
            position,
            ellipsoid,
            cartographicScratch
          )
          return [
            CesiumMath.toDegrees(cartographic.longitude),
            CesiumMath.toDegrees(cartographic.latitude)
          ]
        })
      )
      return feature.geometry
    }

    const feature = polygon([
      [...positions, positions[0]].map(position => {
        const cartographic = Cartographic.fromCartesian(
          position,
          ellipsoid,
          cartographicScratch
        )
        return [
          CesiumMath.toDegrees(cartographic.longitude),
          CesiumMath.toDegrees(cartographic.latitude)
        ]
      })
    ])
    return feature.geometry
  } catch (error) {
    console.error(error)
  }
}

export interface GeometryOptions {
  type: SketchGeometryType
  positions: readonly Cartesian3[]
  ellipsoid?: Ellipsoid
}

export function createGeometry({
  type,
  positions,
  ellipsoid
}: GeometryOptions): LineString | Polygon | MultiPolygon | undefined {
  switch (type) {
    case 'circle':
      return createCircle(positions, ellipsoid)
    case 'rectangle':
      return createRectangle(positions, ellipsoid)
    case 'polygon':
      return createPolygon(positions, ellipsoid)
  }
}
