import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { MapEnvironment } from '../environments/MapEnvironment'
import { SatelliteEnvironment } from '../environments/SatelliteEnvironment'
import { BingMapsImageryLayer } from '../imageryLayers/BingMapsImageryLayer'
import { VectorMapImageryLayer } from '../imageryLayers/VectorMapImageryLayer'
import {
  colorModeAtom,
  debugSphericalHarmonicsAtom,
  environmentTypeAtom
} from '../states/app'

export type EnvironmentType = 'map' | 'satellite'

export const Environments: FC = () => {
  const environmentType = useAtomValue(environmentTypeAtom)
  const colorMode = useAtomValue(colorModeAtom)
  const debugSphericalHarmonics = useAtomValue(debugSphericalHarmonicsAtom)
  switch (environmentType) {
    case 'map':
      return (
        <>
          <MapEnvironment
            debugSphericalHarmonics={debugSphericalHarmonics}
            colorMode={colorMode}
          />
          <VectorMapImageryLayer
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
      return (
        <>
          <SatelliteEnvironment
            debugSphericalHarmonics={debugSphericalHarmonics}
          />
          <BingMapsImageryLayer />
        </>
      )
  }
}
