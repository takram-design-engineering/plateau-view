import { Cartesian2, Ray, type Cartesian3, type Scene } from '@cesium/engine'

import { getRayEllipsoidIntersection } from './getRayEllipsoidIntersection'

const rayScratch = new Ray()

export function getCameraEllipsoidIntersection(
  scene: Scene,
  result?: Cartesian3
): Cartesian3

export function getCameraEllipsoidIntersection(
  scene: Scene,
  windowPosition: Cartesian2,
  result?: Cartesian3
): Cartesian3 | undefined

export function getCameraEllipsoidIntersection(
  scene: Scene,
  resultOrWindowPosition?: Cartesian2 | Cartesian3,
  result?: Cartesian3
): Cartesian3 | undefined {
  if (resultOrWindowPosition instanceof Cartesian2) {
    const ray = scene.camera.getPickRay(resultOrWindowPosition, rayScratch)
    if (ray == null) {
      return undefined
    }
    return getRayEllipsoidIntersection(
      rayScratch,
      scene.globe.ellipsoid,
      result
    )
  }
  scene.camera.positionWC.clone(rayScratch.origin)
  scene.camera.directionWC.clone(rayScratch.direction)
  return getRayEllipsoidIntersection(
    rayScratch,
    scene.globe.ellipsoid,
    resultOrWindowPosition
  )
}
