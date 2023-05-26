import {
  IntersectionTests,
  Ray,
  type Cartesian3,
  type Ellipsoid
} from '@cesium/engine'

export function getRayEllipsoidIntersection(
  ray: Ray,
  ellipsoid: Ellipsoid,
  result?: Cartesian3
): Cartesian3 {
  const intersection = IntersectionTests.rayEllipsoid(ray, ellipsoid)
  if (intersection == null) {
    // Point along the ray which is nearest to the ellipsoid.
    const cartesian = IntersectionTests.grazingAltitudeLocation(ray, ellipsoid)
    return result != null ? cartesian.clone(result) : cartesian
  }
  return Ray.getPoint(ray, intersection.start, result)
}
