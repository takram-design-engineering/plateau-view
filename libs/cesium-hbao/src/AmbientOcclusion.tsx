import { PerspectiveFrustum } from '@cesium/engine'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'
import { withEphemerality } from '@takram/plateau-react-helpers'

import {
  createAmbientOcclusionStage,
  type AmbientOcclusionStageOptions,
  type AmbientOcclusionStageUniforms
} from './createAmbientOcclusionStage'

export interface AmbientOcclusionProps
  extends Omit<AmbientOcclusionStageOptions, 'prefix'>,
    Partial<AmbientOcclusionStageUniforms> {
  enabled?: boolean
}

export const AmbientOcclusion = withEphemerality(
  () => useCesium(({ scene }) => scene).postProcessStages,
  [],
  ({
    enabled = true,
    textureScale,
    directions,
    steps,
    denoise,
    accurateNormalReconstruction,
    outputType,
    ...uniforms
  }: AmbientOcclusionProps) => {
    const scene = useCesium(({ scene }) => scene)
    const stage = useInstance({
      owner: scene.postProcessStages,
      keys: [
        textureScale,
        steps,
        directions,
        denoise,
        accurateNormalReconstruction,
        outputType
      ],
      create: () => {
        const stage = createAmbientOcclusionStage({
          textureScale,
          steps,
          directions,
          denoise,
          accurateNormalReconstruction,
          outputType,
          uniforms
        })
        stage.enabled = enabled
        return stage
      },
      transferOwnership: (stage, postProcessStages) => {
        postProcessStages.add(stage)
        return () => {
          postProcessStages.remove(stage)
        }
      }
    })

    stage.enabled = enabled
    Object.assign(stage.uniforms, uniforms)

    usePreRender(() => {
      const frustum = scene.camera.frustum
      invariant(frustum instanceof PerspectiveFrustum)
      const cotFovy = 1 / Math.tan(frustum.fovy / 2)
      stage.uniforms.focalLength.x = cotFovy * frustum.aspectRatio
      stage.uniforms.focalLength.y = cotFovy
    })

    return null
  }
)
