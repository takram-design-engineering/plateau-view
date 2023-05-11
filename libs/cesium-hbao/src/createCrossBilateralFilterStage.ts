import {
  PostProcessStage,
  PostProcessStageComposite,
  PostProcessStageSampleMode
} from '@cesium/engine'
import { defaults } from 'lodash'

import { type AmbientOcclusionOutputType } from './AmbientOcclusionOutputType'
import { createUniforms } from './createUniforms'
import crossBilateralFilter from './shaders/crossBilateralFilter.glsl?raw'
import packing from './shaders/packing.glsl?raw'
import reconstructPosition from './shaders/reconstructPosition.glsl?raw'

export interface CrossBilateralFilterStageUniforms {
  textureScale: number
  frustumLength: number
  normalExponent: number
  depthExponent: number
}

const defaultUniforms: CrossBilateralFilterStageUniforms = {
  textureScale: 1,
  frustumLength: 1e5,
  normalExponent: 5,
  depthExponent: 1
}

export interface CrossBilateralFilterStageOptions {
  prefix?: string
  outputType?: AmbientOcclusionOutputType | null
  uniforms?: Partial<CrossBilateralFilterStageUniforms>
}

export function createBilateralFilterStage({
  prefix = 'plateau',
  outputType = null,
  uniforms: uniformsOption
}: CrossBilateralFilterStageOptions): PostProcessStageComposite {
  const uniforms = defaults({}, uniformsOption, defaultUniforms)

  const blurX = new PostProcessStage({
    name: `${prefix}_ambient_occlusion_cross_bilateral_filter_x`,
    fragmentShader: `
      #define DIRECTION (0)
      ${outputType != null ? `#define OUTPUT_TYPE (${outputType})` : ''}
      ${packing}
      ${reconstructPosition}
      ${crossBilateralFilter}
    `,
    uniforms,
    sampleMode: PostProcessStageSampleMode.LINEAR
  })

  const blurY = new PostProcessStage({
    name: `${prefix}_ambient_occlusion_cross_bilateral_filter_y`,
    fragmentShader: `
      #define DIRECTION (1)
      ${outputType != null ? `#define OUTPUT_TYPE (${outputType})` : ''}
      ${packing}
      ${reconstructPosition}
      ${crossBilateralFilter}
    `,
    uniforms,
    sampleMode: PostProcessStageSampleMode.LINEAR
  })

  return new PostProcessStageComposite({
    name: `${prefix}_ambient_occlusion_cross_bilateral_filter`,
    stages: [blurX, blurY],
    uniforms: createUniforms<CrossBilateralFilterStageUniforms>([
      {
        stages: [blurX, blurY],
        uniforms: [
          'textureScale',
          'frustumLength',
          'normalExponent',
          'depthExponent'
        ]
      }
    ])
  })
}
