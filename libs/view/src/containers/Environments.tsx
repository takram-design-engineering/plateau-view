import { useAtomValue } from 'jotai'
import { type FC } from 'react'
import invariant from 'tiny-invariant'

import {
  BingMapsImageryLayer,
  VectorMapImageryLayer
} from '@takram/plateau-datasets'

import { GooglePhotorealisticEnvironment } from '../environments/GooglePhotorealisticEnvironment'
import { MapEnvironment } from '../environments/MapEnvironment'
import { SatelliteEnvironment } from '../environments/SatelliteEnvironment'
import {
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom
} from '../states/app'

export type EnvironmentType = 'map' | 'satellite' | 'google-photorealistic'

export const Environments: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const colorMode = useAtomValue(colorModeAtom)
  const debugSphericalHarmonics = useAtomValue(debugSphericalHarmonicsAtom)

  switch (environmentType) {
    case 'map':
      invariant(
        process.env.NEXT_PUBLIC_TILES_BASE_URL != null,
        'Missing environment variable: NEXT_PUBLIC_TILES_BASE_URL'
      )
      return (
        <>
          <MapEnvironment
            debugSphericalHarmonics={debugSphericalHarmonics}
            colorMode={colorMode}
          />
          <VectorMapImageryLayer
            baseUrl={process.env.NEXT_PUBLIC_TILES_BASE_URL}
            {...{
              light: {
                contrast: 0.5,
                brightness: 1.4
              },
              dark: {
                contrast: 1.25,
                brightness: 0.35
              }
            }[colorMode]}
          />
        </>
      )
    case 'satellite':
      invariant(
        process.env.NEXT_PUBLIC_BING_MAPS_APP_KEY != null,
        'Missing environment variable: NEXT_PUBLIC_BING_MAPS_APP_KEY'
      )
      return (
        <>
          <SatelliteEnvironment
            debugSphericalHarmonics={debugSphericalHarmonics}
          />
          <BingMapsImageryLayer
            appKey={process.env.NEXT_PUBLIC_BING_MAPS_APP_KEY}
          />
        </>
      )
    case 'google-photorealistic':
      return <GooglePhotorealisticEnvironment />
  }
}
