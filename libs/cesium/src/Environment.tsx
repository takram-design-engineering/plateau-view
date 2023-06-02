import { Cartesian3, Color } from '@cesium/engine'
import { memo, useMemo, type FC } from 'react'

import { useCesium } from './useCesium'
import { useModifyGlobeShaders, type GlobeShader } from './useGlobeShader'

function cloneColor(value: Color | string | number, result?: Color): Color {
  return typeof value === 'string'
    ? Color.fromCssColorString(value, result)
    : typeof value === 'number'
    ? Color.fromRgba(value, result)
    : Color.clone(value, result)
}

// nx = red
// ny = green
// nz = blue
// px = cyan
// py = magenta
// pz = yellow
const debugSphericalHarmonicCoefficients = [
  new Cartesian3(0.499745965003967, 0.499196201562881, 0.500154078006744), // L00, irradiance, pre-scaled base
  new Cartesian3(0.265826553106308, -0.266099184751511, 0.265922993421555), // L1-1, irradiance, pre-scaled base
  new Cartesian3(0.243236944079399, 0.266723394393921, -0.265380442142487), // L10, irradiance, pre-scaled base
  new Cartesian3(-0.266895800828934, 0.265416264533997, 0.266921550035477), // L11, irradiance, pre-scaled base
  new Cartesian3(0.000195000306121, -0.000644546060357, -0.000383183418307), // L2-2, irradiance, pre-scaled base
  new Cartesian3(-0.000396036746679, -0.000622032093816, 0.000262127199676), // L2-1, irradiance, pre-scaled base
  new Cartesian3(-0.000214280473301, 0.00004872302452, -0.000059724134189), // L20, irradiance, pre-scaled base
  new Cartesian3(0.000107143961941, -0.000126510843984, -0.000425444566645), // L21, irradiance, pre-scaled base
  new Cartesian3(-0.000069071611506, 0.000134039684781, -0.000119135256682) // L22, irradiance, pre-scaled base
]

const sphericalHarmonicCoefficientsScratch = [
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3(),
  new Cartesian3()
]

export interface EnvironmentProps {
  backgroundColor?: Color | string | number
  globeBaseColor?: Color | string | number
  showGlobe?: boolean
  enableGlobeLighting?: boolean
  globeImageBasedLightingFactor?: number
  globeShader?: GlobeShader
  lightColor?: Color | string | number
  lightIntensity?: number
  shadowDarkness?: number
  imageBasedLightingIntensity?: number
  sphericalHarmonicCoefficients?: readonly Cartesian3[]
  debugSphericalHarmonics?: boolean
  showSun?: boolean
  showMoon?: boolean
  showSkyBox?: boolean
  enableFog?: boolean
  fogDensity?: number
  showSkyAtmosphere?: boolean
  showGroundAtmosphere?: boolean
  atmosphereSaturationShift?: number
  atmosphereBrightnessShift?: number
  skyAtmosphereSaturationShift?: number
  skyAtmosphereBrightnessShift?: number
  groundAtmosphereSaturationShift?: number
  groundAtmosphereBrightnessShift?: number
}

export const Environment: FC<EnvironmentProps> = memo(
  ({
    backgroundColor = Color.BLACK,
    globeBaseColor = Color.BLACK,
    showGlobe = true,
    enableGlobeLighting = false,
    globeImageBasedLightingFactor = 0.3,
    globeShader,
    lightColor = Color.WHITE,
    lightIntensity = 2,
    shadowDarkness = 0.3,
    imageBasedLightingIntensity = 1,
    sphericalHarmonicCoefficients,
    debugSphericalHarmonics = false,
    showSun = true,
    showMoon = false,
    showSkyBox = true,
    enableFog = true,
    fogDensity = 0.0002,
    showSkyAtmosphere = true,
    showGroundAtmosphere = true,
    atmosphereSaturationShift = 0,
    atmosphereBrightnessShift = 0,
    skyAtmosphereSaturationShift,
    skyAtmosphereBrightnessShift,
    groundAtmosphereSaturationShift,
    groundAtmosphereBrightnessShift
  }) => {
    const scene = useCesium(({ scene }) => scene)

    cloneColor(backgroundColor, scene.backgroundColor)
    scene.globe.baseColor = cloneColor(globeBaseColor)
    scene.globe.show = showGlobe
    scene.globe.enableLighting = enableGlobeLighting
    // This uniform is used as the factor of IBL, so that I don't have to create
    // and bind a new uniform.
    scene.globe.vertexShadowDarkness = globeImageBasedLightingFactor

    // Light and shadow
    cloneColor(lightColor, scene.light.color)
    scene.light.intensity = debugSphericalHarmonics ? 0.5 : lightIntensity
    scene.shadowMap.darkness = shadowDarkness

    // Image-based lighting
    const scaledSphericalHarmonicCoefficients = useMemo(
      () =>
        sphericalHarmonicCoefficients != null
          ? sphericalHarmonicCoefficients.map((cartesian, index) =>
              Cartesian3.multiplyByScalar(
                cartesian,
                imageBasedLightingIntensity,
                sphericalHarmonicCoefficientsScratch[index]
              )
            )
          : undefined,
      [imageBasedLightingIntensity, sphericalHarmonicCoefficients]
    )
    scene.sphericalHarmonicCoefficients = debugSphericalHarmonics
      ? debugSphericalHarmonicCoefficients
      : scaledSphericalHarmonicCoefficients ?? []

    // Celestial
    if (scene.skyBox != null) {
      scene.sun.show = showSun
      scene.moon.show = showMoon
      scene.skyBox.show = showSkyBox
    }

    // Fog
    scene.fog.enabled = enableFog
    scene.fog.density = fogDensity

    // Sky atmosphere
    scene.skyAtmosphere.show = showSkyAtmosphere
    scene.skyAtmosphere.saturationShift =
      skyAtmosphereSaturationShift ?? atmosphereSaturationShift
    scene.skyAtmosphere.brightnessShift =
      skyAtmosphereBrightnessShift ?? atmosphereBrightnessShift

    // Ground atmosphere
    scene.globe.showGroundAtmosphere = showGroundAtmosphere
    scene.globe.atmosphereSaturationShift =
      groundAtmosphereSaturationShift ?? atmosphereSaturationShift
    scene.globe.atmosphereBrightnessShift =
      groundAtmosphereBrightnessShift ?? atmosphereBrightnessShift

    scene.requestRender()

    useModifyGlobeShaders({
      sphericalHarmonicCoefficients: debugSphericalHarmonics
        ? debugSphericalHarmonicCoefficients
        : scaledSphericalHarmonicCoefficients ?? [],
      shader: globeShader
    })

    return null
  }
)
