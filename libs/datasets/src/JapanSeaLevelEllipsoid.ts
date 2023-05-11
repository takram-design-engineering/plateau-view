import { Ellipsoid } from '@cesium/engine'

// See https://www.gsi.go.jp/sokuchikijun/datum-main.html#p2
const a = 6378137
const f = 1 / 298.257222101
const b = (1 - f) * a

// Geoidal height of Japanese datum of leveling.
const k = 36.7071

// A shape offset from an ellipsoid is not an ellipsoid unless it's a sphere;
// this is just an approximation.
export const JapanSeaLevelEllipsoid = new Ellipsoid(a + k, a + k, b + k)
