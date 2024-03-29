import { Cartesian3, Color } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { useEffect, useState, type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  Environment,
  type EnvironmentProps,
  type ImageryLayerHandle
} from '@takram/plateau-cesium'
import { VectorMapImageryLayer } from '@takram/plateau-datasets'
import { type ColorMode } from '@takram/plateau-shared-states'

import { enableTerrainLightingAtom } from '../states/app'

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
  invariant(
    process.env.NEXT_PUBLIC_TILES_BASE_URL != null,
    'Missing environment variable: NEXT_PUBLIC_TILES_BASE_URL'
  )
  const enableTerrainLighting = useAtomValue(enableTerrainLightingAtom)

  const [layer, setLayer] = useState<ImageryLayerHandle | null>(null)
  useEffect(() => {
    layer?.sendToBack()
  }, [layer])

  return (
    <>
      <Environment
        // TODO: Define in theme
        // TODO: Swap background when view is ready
        globeBaseColor={
          colorMode === 'light'
            ? Color.fromCssColorString('#bfbfbf')
            : Color.fromCssColorString('#000000')
        }
        enableGlobeLighting={enableTerrainLighting}
        lightIntensity={12}
        shadowDarkness={colorMode === 'light' ? 0.7 : 0.3}
        imageBasedLightingIntensity={1}
        sphericalHarmonicCoefficients={sphericalHarmonicCoefficients}
        showSkyBox={false}
        atmosphereSaturationShift={-1}
        groundAtmosphereBrightnessShift={2}
        {...props}
      />
      <VectorMapImageryLayer
        ref={setLayer}
        baseUrl={process.env.NEXT_PUBLIC_TILES_BASE_URL}
        path={colorMode === 'light' ? 'light-map' : 'dark-map'}
      />
    </>
  )
}
