import { Cartesian3, type Scene } from '@cesium/engine'

import { flyToDestination } from './flyToDestination'
import { getCameraEllipsoidIntersection } from './getCameraEllipsoidIntersection'
import { type FlyToOptions } from './types'

const cartesianScratch = new Cartesian3()

export async function animateZoom(
  scene: Scene,
  multiplier: number,
  options?: FlyToOptions
): Promise<void> {
  const camera = scene.camera
  const focus = getCameraEllipsoidIntersection(scene, cartesianScratch)
  const direction = Cartesian3.subtract(
    focus,
    camera.position,
    cartesianScratch
  )
  const movement = Cartesian3.multiplyByScalar(
    direction,
    multiplier,
    cartesianScratch
  )
  const position = Cartesian3.add(camera.position, movement, cartesianScratch)
  await flyToDestination(scene, position, undefined, options)
}
