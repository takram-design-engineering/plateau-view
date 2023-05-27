/* eslint-disable no-useless-concat */

import {
  Material,
  ShaderSource,
  type Cartesian3,
  type Globe,
  type Scene
} from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { withEphemerality } from '@takram/plateau-react-helpers'

import { ShaderCodeInjector } from './helpers/ShaderCodeInjector'
import imageBasedLightingStage from './shaders/imageBasedLightingStage.glsl?raw'
import { useCesium } from './useCesium'

function modifyGlobeShaderSource(
  scene: Scene,
  params: {
    sphericalHarmonicCoefficients?: readonly Cartesian3[]
  }
): (() => void) | undefined {
  if (params.sphericalHarmonicCoefficients == null) {
    return // TODO
  }

  // Private API
  const globe = scene.globe as Globe & {
    _surfaceShaderSet: {
      baseFragmentShaderSource: ShaderSource
    }
  }
  const surfaceShaderSet = globe._surfaceShaderSet
  const baseFragmentShaderSource = surfaceShaderSet.baseFragmentShaderSource
  const sources = baseFragmentShaderSource.sources

  const sphericalHarmonicCoefficients = params.sphericalHarmonicCoefficients
    .map(({ x, y, z }) => `vec3(${x}, ${y}, ${z})`)
    .join(',')

  const globeFS = new ShaderCodeInjector(sources[sources.length - 1])
    .replace(
      'void main()',
      /* glsl */ `
      const vec3 sphericalHarmonicCoefficients[9] = vec3[](
        ${sphericalHarmonicCoefficients}
      );
      ${imageBasedLightingStage}
      void main()
    `
    )
    .replace(
      [
        'float diffuseIntensity = clamp(czm_getLambertDiffuse(czm_lightDirectionEC, normalize(v_normalEC)) * u_lambertDiffuseMultiplier + u_vertexShadowDarkness, 0.0, 1.0);',
        'vec4 finalColor = vec4(color.rgb * czm_lightColor * diffuseIntensity, color.a);'
      ],
      /* glsl */ `
      czm_pbrParameters pbrParameters;
      pbrParameters.diffuseColor = color.rgb;
      // Specular parameters are not used.

      vec3 lighting = czm_pbrLighting(
        v_positionEC,
        v_normalEC,
        czm_lightDirectionEC,
        czm_lightColorHdr,
        pbrParameters
      );
      lighting += imageBasedLightingStage(
        v_positionEC,
        v_normalEC,
        czm_lightDirectionEC,
        czm_lightColorHdr,
        pbrParameters
      ) * u_vertexShadowDarkness; // See discussion in Environment.

      #ifndef HDR
      lighting = czm_acesTonemapping(lighting);
      lighting = czm_linearToSrgb(lighting);
      #endif

      vec4 finalColor = vec4(color.rgb * lighting, color.a);
      `
    )
    .toString()

  surfaceShaderSet.baseFragmentShaderSource = new ShaderSource({
    sources: [...baseFragmentShaderSource.sources.slice(0, -1), globeFS],
    defines: baseFragmentShaderSource.defines
  })

  return () => {
    if (globe.isDestroyed()) {
      return
    }
    // Invoke the internal makeShadersDirty() by setting a material to globe to
    // reset surface shader source to the initial state.
    globe.material = Material.fromType('Color')
    globe.material = undefined
  }
}

export interface GlobeShaderProps {
  sphericalHarmonicCoefficients?: readonly Cartesian3[]
}

export const GlobeShader: FC<GlobeShaderProps> = withEphemerality(
  () => useCesium(({ scene }) => scene),
  [],
  ({ sphericalHarmonicCoefficients }) => {
    const scene = useCesium(({ scene }) => scene)
    useEffect(() => {
      return modifyGlobeShaderSource(scene, {
        sphericalHarmonicCoefficients
      })
    }, [scene, sphericalHarmonicCoefficients])
    return null
  }
)
