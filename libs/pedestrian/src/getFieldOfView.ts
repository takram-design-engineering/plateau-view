import { Cartesian2, PerspectiveFrustum, type Scene } from '@cesium/engine'
import invariant from 'tiny-invariant'

const cartesianScratch = new Cartesian2()

export function getFieldOfView(scene: Scene, zoom: number): number {
  const fov = getFieldOfViewSeparate(zoom, cartesianScratch)
  const frustum = scene.camera.frustum
  invariant(frustum instanceof PerspectiveFrustum)
  return frustum.aspectRatio > 1 ? fov.x : fov.y
}

export function getFieldOfViewSeparate(
  zoom: number,
  result = new Cartesian2()
): Cartesian2 {
  result.x = Math.PI / Math.pow(2, zoom)
  result.y = 2 * Math.atan((3 / 2) * Math.tan(result.x / 2))
  return result
}
