declare module '@cesium/engine' {
  // https://github.com/CesiumGS/cesium/blob/1.105/packages/engine/Source/Core/EllipsoidalOccluder.js
  export class EllipsoidalOccluder {
    constructor(ellipsoid: Ellipsoid, cameraPosition: Cartesian3)

    readonly ellipsoid: Ellipsoid
    cameraPosition: Cartesian3
    position: Cartesian3

    isPointVisible: (occludee: Cartesian3) => boolean
  }
}
