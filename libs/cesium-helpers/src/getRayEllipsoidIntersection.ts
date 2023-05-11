import {
  Cartesian3,
  IntersectionTests,
  Ray,
  type Ellipsoid
} from '@cesium/engine'

export function getRayEllipsoidIntersection(
  ray: Ray,
  ellipsoid: Ellipsoid,
  result?: Cartesian3
): Cartesian3 {
  const intersection = IntersectionTests.rayEllipsoid(ray, ellipsoid)
  const cartesian = result ?? new Cartesian3()
  if (intersection == null) {
    // Point along the ray which is nearest to the ellipsoid.
    IntersectionTests.grazingAltitudeLocation(ray, ellipsoid).clone(cartesian)
  }
  Ray.getPoint(ray, intersection.start, cartesian)
  return cartesian
}
