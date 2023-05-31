/* eslint-disable no-useless-concat */

import {
  Material,
  ShaderSource,
  type Cartesian3,
  type Globe,
  type TerrainProvider
} from '@cesium/engine'
import { useEffect, useRef } from 'react'

import { assertType } from '@takram/plateau-type-helpers'

import { ShaderCodeInjector } from './helpers/ShaderCodeInjector'
import imageBasedLightingStage from './shaders/imageBasedLightingStage.glsl?raw'
import { useCesium } from './useCesium'

function makeGlobeShadersDirty(globe: PrivateGlobe): void {
  // Invoke the internal makeShadersDirty() by setting a material to globe to
  // reset surface shader source to the initial state (assuming that we never
  // use custom material on globe).
  const material = globe.material
  if (material == null) {
    globe.material = Material.fromType('Color')
    globe.material = undefined
  } else {
    globe.material = undefined
    globe.material = material
  }
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

function modifyGlobeShaders(
  globe: Globe,
  uniforms: {
    sphericalHarmonicCoefficients: () => readonly Cartesian3[]
  }
): void {
  // TODO: This does make shaders dirty, but doesn't propagate to all the shader
  // program caches, which I don't yet know where they are managed.
  assertType<PrivateGlobe>(globe)
  makeGlobeShadersDirty(globe)

  globe._surface._tileProvider.materialUniformMap = {
    ...globe._surface._tileProvider.materialUniformMap,
    u_sphericalHarmonicCoefficients: uniforms.sphericalHarmonicCoefficients
  }

  const surfaceShaderSet = globe._surfaceShaderSet
  const baseFragmentShaderSource = surfaceShaderSet.baseFragmentShaderSource
  const sources = baseFragmentShaderSource.sources

  const globeFS = new ShaderCodeInjector(sources[sources.length - 1])
    // Use the diffuse of the globe material as initial color, as I want to
    // render imagery layers over it.
    .replace(
      'vec4 color = computeDayColor(u_initialColor',
      /* glsl */ `
      vec4 initialColor;
      #ifdef APPLY_MATERIAL
        czm_materialInput materialInput;
        materialInput.st = v_textureCoordinates.st;
        materialInput.normalEC = normalize(v_normalEC);
        materialInput.positionToEyeEC = -v_positionEC;
        materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, normalize(v_normalEC));
        materialInput.slope = v_slope;
        materialInput.height = v_height;
        materialInput.aspect = v_aspect;
        czm_material material = czm_getMaterial(materialInput);
        initialColor = vec4(material.diffuse, material.alpha);
      #else
        initialColor = u_initialColor;
      #endif
      vec4 color = computeDayColor(initialColor`
    )
    .replace(
      [
        '#ifdef APPLY_MATERIAL',
        'czm_materialInput materialInput;',
        'materialInput.st = v_textureCoordinates.st;',
        'materialInput.normalEC = normalize(v_normalEC);',
        'materialInput.positionToEyeEC = -v_positionEC;',
        'materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, normalize(v_normalEC));',
        'materialInput.slope = v_slope;',
        'materialInput.height = v_height;',
        'materialInput.aspect = v_aspect;',
        'czm_material material = czm_getMaterial(materialInput);',
        'vec4 materialColor = vec4(material.diffuse, material.alpha);',
        'color = alphaBlend(materialColor, color);',
        '#endif'
      ],
      ''
    )
    // Inject IBL stage.
    .replace(
      'void main()',
      /* glsl */ `
      uniform vec3 u_sphericalHarmonicCoefficients[9];
      ${imageBasedLightingStage}
      void main()`
    )
    // Inject IBL diffuse.
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

      vec4 finalColor = vec4(color.rgb * lighting, color.a);`
    )
    .toString()

  surfaceShaderSet.baseFragmentShaderSource = new ShaderSource({
    sources: [...baseFragmentShaderSource.sources.slice(0, -1), globeFS],
    defines: baseFragmentShaderSource.defines
  })
}

export interface GlobeShaderProps {
  material?: Material
  terrainProvider?: TerrainProvider
  sphericalHarmonicCoefficients: readonly Cartesian3[]
}

export function useModifyGlobeShaders({
  material,
  sphericalHarmonicCoefficients
}: GlobeShaderProps): void {
  const sphericalHarmonicCoefficientsRef = useRef(sphericalHarmonicCoefficients)
  sphericalHarmonicCoefficientsRef.current = sphericalHarmonicCoefficients

  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    scene.globe.material = material
    modifyGlobeShaders(scene.globe, {
      sphericalHarmonicCoefficients: () =>
        sphericalHarmonicCoefficientsRef.current
    })
    return scene.globe.terrainProviderChanged.addEventListener(() => {
      // Surface shader sets are initialized when material or imagery provider
      // have been changed. Listen for imagery provider changes and modify
      // globe shader *after* all the other listeners are invoked.
      const removeListener = scene.preRender.addEventListener(() => {
        modifyGlobeShaders(scene.globe, {
          sphericalHarmonicCoefficients: () =>
            sphericalHarmonicCoefficientsRef.current
        })
        removeListener()
      })
    })
  }, [scene, material])
}
