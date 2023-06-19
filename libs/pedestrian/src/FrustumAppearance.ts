import {
  Color,
  Material,
  PerInstanceColorAppearance,
  VertexFormat
} from '@cesium/engine'

import fragmentShaderSource from './shaders/frustumAppearance.frag.glsl?raw'
import vertexShaderSource from './shaders/frustumAppearance.vert.glsl?raw'

export class FrustumAppearance extends PerInstanceColorAppearance {
  constructor({
    color = Color.WHITE,
    opacity = 1
  }: {
    color?: Color
    opacity?: number
  }) {
    super({
      fragmentShaderSource,
      vertexShaderSource,
      translucent: true
    })

    this.material = new Material({
      fabric: {
        uniforms: {
          color,
          opacity
        },
        components: {
          diffuse: 'color.rgb',
          alpha: 'opacity'
        }
      }
    })
  }

  static VERTEX_FORMAT = new VertexFormat({
    position: true,
    normal: true,
    st: true,
    tangent: true,
    bitangent: true,
    color: true
  })
}
