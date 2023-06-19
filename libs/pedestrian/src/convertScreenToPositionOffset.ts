import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Ellipsoid,
  IntersectionTests,
  Ray,
  SceneTransforms,
  type Scene
} from '@cesium/engine'

const cartographicScratch = new Cartographic()
const radiiScratch = new Cartesian3()
const ellipsoidScratch = new Ellipsoid()
const windowPositionScratch = new Cartesian2()
const rayScratch = new Ray()
const projectionScratch = new Cartesian3()

export function convertScreenToPositionOffset(
  scene: Scene,
  position: Cartesian3,
  screenOffset: {
    x: number
    y: number
  },
  result = new Cartesian3()
): Cartesian3 | undefined {
  const ellipsoid = scene.globe.ellipsoid
  let cartographic
  try {
    cartographic = Cartographic.fromCartesian(
      position,
      ellipsoid,
      cartographicScratch
    )
  } catch (error) {
    return
  }
  radiiScratch.x = ellipsoid.radii.x + cartographic.height
  radiiScratch.y = ellipsoid.radii.y + cartographic.height
  radiiScratch.z = ellipsoid.radii.z + cartographic.height
  const offsetEllipsoid = Ellipsoid.fromCartesian3(
    radiiScratch,
    ellipsoidScratch
  )
  const windowPosition = SceneTransforms.wgs84ToWindowCoordinates(
    scene,
    position,
    windowPositionScratch
  )
  windowPosition.x += screenOffset.x
  windowPosition.y += screenOffset.y
  const ray = scene.camera.getPickRay(windowPosition, rayScratch)
  if (ray == null) {
    return
  }
  const intersection = IntersectionTests.rayEllipsoid(ray, offsetEllipsoid)
  if (intersection == null) {
    return
  }
  const projection = Ray.getPoint(ray, intersection.start, projectionScratch)
  return Cartesian3.subtract(projection, position, result)
}
