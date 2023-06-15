import { Cartesian3, Cartographic, type Scene } from '@cesium/engine'

import { type Location } from './types'

const cartographicScratch = new Cartographic()

export function getPosition(
  scene: Scene,
  { longitude, latitude, height = 0 }: Location,
  result?: Cartesian3
): Cartesian3 {
  return Cartesian3.fromDegrees(
    longitude,
    latitude,
    (scene.globe.getHeight(
      Cartographic.fromDegrees(longitude, latitude, height, cartographicScratch)
    ) ?? 0) + height,
    undefined,
    result
  )
}
