import { Cartesian3, Cartographic, type Scene } from '@cesium/engine'

import { type Location } from './types'

const cartographicScratch = new Cartographic()

export function computeCartographicToCartesian(
  scene: Scene,
  { longitude, latitude, height = 0 }: Location,
  result?: Cartesian3
): Cartesian3 {
  return Cartesian3.fromDegrees(
    longitude,
    latitude,
    // Name of this function starts with "compute" because the computational
    // cost of innocent-looking Globe.getHeight() is very high that we should be
    // careful before invoking this.
    (scene.globe.getHeight(
      Cartographic.fromDegrees(longitude, latitude, height, cartographicScratch)
    ) ?? 0) + height,
    scene.globe.ellipsoid,
    result
  )
}
