/* eslint-disable no-useless-concat */

import {
  Material,
  ShaderSource,
  type Cartesian3,
  type Globe
} from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import { withEphemerality } from '@takram/plateau-react-helpers'

import { ShaderCodeInjector } from './helpers/ShaderCodeInjector'
import imageBasedLightingStage from './shaders/imageBasedLightingStage.glsl?raw'
import { useCesium } from './useCesium'

function makeGlobeShadersDirty(globe: PrivateGlobe): void {
  // Invoke the internal makeShadersDirty() by setting a material to globe to
  // reset surface shader source to the initial state (assuming that we never
  // use custom material on globe).
  globe.material = Material.fromType('Color')
  globe.material = undefined
}

interface PrivateGlobe extends Globe {
  _surface: {
    _tileProvider: {
      materialUniformMap?: object
    }
  }
  _surfaceShaderSet: {
    baseFragmentShaderSource: ShaderSource
  }
}

function modifyGlobeShaderSource(
  globe: PrivateGlobe,
  uniforms: {
    sphericalHarmonicCoefficients: () => readonly Cartesian3[]
  }
): void {
  // TODO: This does make shaders dirty, but doesn't propagate to all the shader
  // program caches, which I don't yet know where they are managed.
  makeGlobeShadersDirty(globe)

  globe._surface._tileProvider.materialUniformMap = {
    ...globe._surface._tileProvider.materialUniformMap,
    u_sphericalHarmonicCoefficients: uniforms.sphericalHarmonicCoefficients
  }

  const surfaceShaderSet = globe._surfaceShaderSet
  const baseFragmentShaderSource = surfaceShaderSet.baseFragmentShaderSource
  const sources = baseFragmentShaderSource.sources

  const globeFS = new ShaderCodeInjector(sources[sources.length - 1])
    .replace(
      'void main()',
      /* glsl */ `
      uniform vec3 u_sphericalHarmonicCoefficients[9];
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

      vec3 normalEC = normalize(v_normalEC);
      vec3 lighting = czm_pbrLighting(
        v_positionEC,
        normalEC,
        czm_lightDirectionEC,
        czm_lightColorHdr,
        pbrParameters
      );
      lighting += imageBasedLightingStage(
        v_positionEC,
        normalEC,
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
}

export interface GlobeShaderProps {
  sphericalHarmonicCoefficients: readonly Cartesian3[]
}

export const GlobeShader: FC<GlobeShaderProps> = withEphemerality(
  () => useCesium(({ scene }) => scene.globe),
  [],
  ({ sphericalHarmonicCoefficients }) => {
    const sphericalHarmonicCoefficientsRef = useRef(
      sphericalHarmonicCoefficients
    )
    sphericalHarmonicCoefficientsRef.current = sphericalHarmonicCoefficients

    const globe = useCesium(({ scene }) => scene.globe)
    useEffect(() => {
      modifyGlobeShaderSource(globe as unknown as PrivateGlobe, {
        sphericalHarmonicCoefficients: () =>
          sphericalHarmonicCoefficientsRef.current
      })
    }, [globe])

    return null
  }
)
