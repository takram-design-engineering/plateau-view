import {
  Cartesian3,
  Cartographic,
  IntersectionTests,
  Plane,
  Ray,
  type Cartesian2,
  type Scene
} from '@cesium/engine'

const cartesianScratch = new Cartesian3()
const normalScratch = new Cartesian3()
const rayScratch = new Ray()
const planeScratch = new Plane(Cartesian3.UNIT_X, 0)
const cartographicScratch = new Cartographic()

export function getExtrudedHeight(
  scene: Scene,
  position: Cartesian3,
  windowPosition: Cartesian2
): number | undefined {
  let intersection
  try {
    const normal = scene.globe.ellipsoid.geodeticSurfaceNormal(
      position,
      normalScratch
    )
    const ray = scene.camera.getPickRay(windowPosition, rayScratch)
    if (ray == null) {
      return
    }
    // Plane coincident with surface normal and perpendicular to another plane
    // coincident with the ray direction.
    const plane = Plane.fromPointNormal(
      position,
      Cartesian3.normalize(
        Cartesian3.cross(
          normal,
          Cartesian3.cross(normal, ray.direction, cartesianScratch),
          cartesianScratch
        ),
        cartesianScratch
      ),
      planeScratch
    )
    intersection = IntersectionTests.rayPlane(ray, plane, cartesianScratch)
    if (intersection == null) {
      return
    }
    const toHeight = Cartographic.fromCartesian(
      intersection,
      scene.globe.ellipsoid,
      cartographicScratch
    ).height
    const fromHeight = Cartographic.fromCartesian(
      position,
      scene.globe.ellipsoid,
      cartographicScratch
    ).height
    return toHeight - fromHeight
  } catch (error) {
    console.error(error)
  }
}
