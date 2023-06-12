import { Color, PerInstanceColorAppearance, VertexFormat } from '@cesium/engine'

import fragmentShaderSource from './shaders/frustumAppearance.frag.glsl?raw'
import vertexShaderSource from './shaders/frustumAppearance.vert.glsl?raw'

function toVec3(color: Color): string {
  return `vec3(float(${color.red}), float(${color.green}), float(${color.blue}))`
}

export class FrustumAppearance extends PerInstanceColorAppearance {
  constructor({
    color = Color.WHITE,
    alpha = 1
  }: {
    color?: Color
    alpha?: number
  }) {
    super({
      fragmentShaderSource: /* glsl */ `
        const vec3 color = ${toVec3(color)};
        const float alpha = float(${alpha});
        ${fragmentShaderSource}
      `,
      vertexShaderSource,
      translucent: true
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
