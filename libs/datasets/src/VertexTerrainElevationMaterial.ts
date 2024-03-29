import { Ellipsoid, Material } from '@cesium/engine'

import { colorMapTurbo } from '@takram/plateau-color-maps'

import { JapanSeaLevelEllipsoid } from './JapanSeaLevelEllipsoid'
import source from './shaders/vertexTerrainElevationMaterial.glsl?raw'

export class VertexTerrainElevationMaterial extends Material {
  constructor() {
    super({
      fabric: {
        type: 'VertexTerrainElevation',
        uniforms: {
          colorMap: colorMapTurbo.createImage(),
          minHeight: 0,
          maxHeight: 1000,
          logarithmic: false,
          // The height of czm_materialInput appears to be in WGS84 even when we
          // provide another ellipsoid in the constructor options of Globe.
          heightDatum:
            Math.min(
              Ellipsoid.WGS84.radii.x,
              Ellipsoid.WGS84.radii.y,
              Ellipsoid.WGS84.radii.z
            ) -
            Math.min(
              JapanSeaLevelEllipsoid.radii.x,
              JapanSeaLevelEllipsoid.radii.y,
              JapanSeaLevelEllipsoid.radii.z
            )
        },
        source
      },
      translucent: false
    })
  }
}
