import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { colorModeAtom } from '@takram/plateau-shared-states'

import { ElevationEnvironment } from '../environments/ElevationEnvironment'
import { GooglePhotorealisticEnvironment } from '../environments/GooglePhotorealisticEnvironment'
import { MapEnvironment } from '../environments/MapEnvironment'
import { SatelliteEnvironment } from '../environments/SatelliteEnvironment'
import { debugSphericalHarmonicsAtom, environmentTypeAtom } from '../states/app'

export type EnvironmentType =
  | 'map'
  | 'satellite'
  | 'elevation'
  | 'google-photorealistic'

export const Environments: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const colorMode = useAtomValue(colorModeAtom)
  const debugSphericalHarmonics = useAtomValue(debugSphericalHarmonicsAtom)

  switch (environmentType) {
    case 'map':
      return (
        <MapEnvironment
          debugSphericalHarmonics={debugSphericalHarmonics}
          colorMode={colorMode}
        />
      )
    case 'satellite':
      return (
        <SatelliteEnvironment
          debugSphericalHarmonics={debugSphericalHarmonics}
        />
      )
    case 'elevation':
      return (
        <ElevationEnvironment
          debugSphericalHarmonics={debugSphericalHarmonics}
        />
      )
    case 'google-photorealistic':
      return <GooglePhotorealisticEnvironment />
  }
}
