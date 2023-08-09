import { Cartesian3, Color } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { useEffect, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  Environment,
  StringMatcher,
  useCesium,
  type EnvironmentProps,
  type ImageryLayerHandle
} from '@takram/plateau-cesium'
import {
  TerrainElevationImageryLayer,
  VertexTerrainElevationMaterial
} from '@takram/plateau-datasets'
import { useConstant } from '@takram/plateau-react-helpers'

import {
  enableTerrainLightingAtom,
  logarithmicTerrainElevationAtom,
  terrainElevationHeightRangeAtom
} from '../states/app'

const sphericalHarmonicCoefficients = [
  new Cartesian3(0.82368016242981, 0.89996325969696, 1.057950735092163), // L00, irradiance, pre-scaled base
  new Cartesian3(0.95617014169693, 1.087422609329224, 1.246641397476196), // L1-1, irradiance, pre-scaled base
  new Cartesian3(0.460439652204514, 0.642218351364136, 0.81517082452774), // L10, irradiance, pre-scaled base
  new Cartesian3(-0.000934832380153, 0.014073264785111, 0.01713084615767), // L11, irradiance, pre-scaled base
  new Cartesian3(-0.064062088727951, -0.072207100689411, -0.074556961655617), // L2-2, irradiance, pre-scaled base
  new Cartesian3(0.508748233318329, 0.619970560073853, 0.730030000209808), // L2-1, irradiance, pre-scaled base
  new Cartesian3(-0.031152218580246, -0.053586609661579, -0.066098868846893), // L20, irradiance, pre-scaled base
  new Cartesian3(0.014958278276026, -0.027591468766332, -0.043796796351671), // L21, irradiance, pre-scaled base
  new Cartesian3(-0.192780449986458, -0.223674207925797, -0.249334931373596) // L22, irradiance, pre-scaled base
]

export const ElevationEnvironment: FC<EnvironmentProps> = props => {
  invariant(
    process.env.NEXT_PUBLIC_API_BASE_URL != null,
    'Missing environment variable: NEXT_PUBLIC_API_BASE_URL'
  )

  const globeShader = useConstant(() => ({
    material: new VertexTerrainElevationMaterial(),
    matcher: new StringMatcher().replace(
      [
        '#ifdef APPLY_COLOR_TO_ALPHA',
        'vec3 colorDiff = abs(color.rgb - colorToAlpha.rgb);',
        'colorDiff.r = max(max(colorDiff.r, colorDiff.g), colorDiff.b);',
        'alpha = czm_branchFreeTernary(colorDiff.r < colorToAlpha.a, 0.0, alpha);',
        '#endif'
      ],
      /* glsl */ `
      // colorToAlpha is used as an identification of imagery layer here.
      if (greaterThan(colorToAlpha, vec4(0.9)) == bvec4(true)) {
        float decodedValue = dot(color, vec3(16711680.0, 65280.0, 255.0));
        float height = (decodedValue - 8388607.0) * 0.01;
        float minHeight = czm_branchFreeTernary(
          logarithmic_3,
          pseudoLog(minHeight_1),
          minHeight_1
        );
        float maxHeight = czm_branchFreeTernary(
          logarithmic_3,
          pseudoLog(maxHeight_2),
          maxHeight_2
        );
        float value = czm_branchFreeTernary(
          logarithmic_3,
          pseudoLog(height),
          height
        );
        float normalizedHeight = clamp(
          (value - minHeight) / (maxHeight - minHeight),
          0.0,
          1.0
        );
        vec4 mappedColor = texture(colorMap_0, vec2(normalizedHeight, 0.5));
        color = mappedColor.rgb;
      }`
    )
  }))

  const terrainElevationHeightRange = useAtomValue(
    terrainElevationHeightRangeAtom
  )
  const logarithmicTerrainElevation = useAtomValue(
    logarithmicTerrainElevationAtom
  )
  globeShader.material.uniforms.minHeight = terrainElevationHeightRange[0]
  globeShader.material.uniforms.maxHeight = terrainElevationHeightRange[1]
  globeShader.material.uniforms.logarithmic = logarithmicTerrainElevation
  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  const enableTerrainLighting = useAtomValue(enableTerrainLightingAtom)

  const [layer, setLayer] = useState<ImageryLayerHandle | null>(null)
  useEffect(() => {
    layer?.sendToBack()
  }, [layer])

  return (
    <>
      <Environment
        backgroundColor={Color.BLACK}
        globeBaseColor={Color.BLACK}
        enableGlobeLighting={enableTerrainLighting}
        globeShader={globeShader}
        lightIntensity={10}
        shadowDarkness={0.5}
        imageBasedLightingIntensity={1}
        sphericalHarmonicCoefficients={sphericalHarmonicCoefficients}
        showSkyBox={false}
        atmosphereSaturationShift={-1}
        groundAtmosphereBrightnessShift={2}
        {...props}
      />
      <TerrainElevationImageryLayer
        ref={setLayer}
        baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
        colorToAlpha={Color.WHITE}
        colorToAlphaThreshold={1}
      />
    </>
  )
}
