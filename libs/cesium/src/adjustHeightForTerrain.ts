import {
  Cartesian3,
  Cartographic,
  Matrix4,
  type Camera,
  type Scene
} from '@cesium/engine'

import { assertType } from '@takram/plateau-type-helpers'

const transformScratch = new Matrix4()
const cartographicScratch = new Cartographic()

// Reference: https://github.com/CesiumGS/cesium/blob/1.104/packages/engine/Source/Scene/ScreenSpaceCameraController.js#L2748
export function adjustHeightForTerrain(
  scene: Scene,
  minimumDistance: number
): void {
  const globe = scene.globe
  const camera = scene.camera
  const ellipsoid = globe.ellipsoid

  assertType<Camera & { _setTransform: (matrix: Matrix4) => void }>(camera)

  let transform
  let magnitude = 0
  if (!Matrix4.equals(camera.transform, Matrix4.IDENTITY)) {
    transform = Matrix4.clone(camera.transform, transformScratch)
    magnitude = Cartesian3.magnitude(camera.position)
    camera._setTransform(Matrix4.IDENTITY)
  }

  const cartographic = cartographicScratch
  ellipsoid.cartesianToCartographic(camera.position, cartographic)

  let heightUpdated = false
  const { globeHeight } = scene as Scene & { globeHeight?: number }
  if (globeHeight != null) {
    const height = globeHeight + minimumDistance
    if (cartographic.height < height) {
      cartographic.height = height
      ellipsoid.cartographicToCartesian(cartographic, camera.position)
      heightUpdated = true
    }
  }

  if (transform != null) {
    camera._setTransform(transform)
    if (heightUpdated) {
      Cartesian3.normalize(camera.position, camera.position)
      Cartesian3.negate(camera.position, camera.direction)
      Cartesian3.multiplyByScalar(
        camera.position,
        Math.max(magnitude, minimumDistance),
        camera.position
      )
      Cartesian3.normalize(camera.direction, camera.direction)
      Cartesian3.cross(camera.direction, camera.up, camera.right)
      Cartesian3.cross(camera.right, camera.direction, camera.up)
    }
  }
}
