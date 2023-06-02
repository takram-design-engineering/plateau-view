import { Material } from '@cesium/engine'

import { colorSchemeTurbo } from '@takram/plateau-color-schemes'

// TODO: Connect uniforms to state.
// TODO: Use Japanese datum of leveling.
export class VertexTerrainElevationMaterial extends Material {
  constructor() {
    super({
      fabric: {
        type: 'ElevationRamp',
        uniforms: {
          image: colorSchemeTurbo.createImage(),
          minimumHeight: 0,
          maximumHeight: 1000
        }
      },
      translucent: false
    })
  }
}
