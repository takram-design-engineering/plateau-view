import { Cartesian3, Color } from '@cesium/engine'
import { type FC } from 'react'

import { Environment, type EnvironmentProps } from '@plateau/cesium'

import { type ColorMode } from '../states/app'

// Flat white sky and gray ground
const sphericalHarmonicCoefficients = [
  new Cartesian3(0.651181936264038, 0.651181936264038, 0.651181936264038), // L00, irradiance, pre-scaled base
  new Cartesian3(0.335859775543213, 0.335859775543213, 0.335859775543213), // L1-1, irradiance, pre-scaled base
  new Cartesian3(0.000000874592729, 0.000000874592729, 0.000000874592729), // L10, irradiance, pre-scaled base
  new Cartesian3(0.000000027729817, 0.000000027729817, 0.000000027729817), // L11, irradiance, pre-scaled base
  new Cartesian3(0.000000014838997, 0.000000014838997, 0.000000014838997), // L2-2, irradiance, pre-scaled base
  new Cartesian3(-0.000000005038311, -0.000000005038311, -0.000000005038311), // L2-1, irradiance, pre-scaled base
  new Cartesian3(0.000121221753943, 0.000121221753943, 0.000121221753943), // L20, irradiance, pre-scaled base
  new Cartesian3(0.000000282587223, 0.000000282587223, 0.000000282587223), // L21, irradiance, pre-scaled base
  new Cartesian3(0.000364663166692, 0.000364663166692, 0.000364663166692) // L22, irradiance, pre-scaled base
]

export interface MapEnvironmentProps extends EnvironmentProps {
  colorMode?: ColorMode
}

export const MapEnvironment: FC<MapEnvironmentProps> = ({
  colorMode = 'light',
  ...props
}) => {
  return (
    <Environment
      // TODO: Define in theme
      // TODO: Swap background when view is ready
      backgroundColor={
        colorMode === 'light'
          ? Color.fromCssColorString('#f7f7f7')
          : Color.fromCssColorString('#000000')
      }
      globeBaseColor={
        colorMode === 'light'
          ? Color.fromCssColorString('#f7f7f7')
          : Color.fromCssColorString('#000000')
      }
      lightIntensity={colorMode === 'light' ? 10 : 0.5}
      shadowDarkness={colorMode === 'light' ? 0.7 : 0.6}
      imageBasedLightingIntensity={colorMode === 'light' ? 1 : 0.15}
      sphericalHarmonicCoefficients={sphericalHarmonicCoefficients}
      showSkyBox={false}
      atmosphereSaturationShift={-1}
      groundAtmosphereBrightnessShift={2}
      {...props}
    />
  )
}
