import { Cartesian3, HeadingPitchRoll } from '@cesium/engine'
import { useSetAtom } from 'jotai'
import { Suspense, useCallback, useEffect, type FC } from 'react'

import { CurrentTime, ViewLocator } from '@takram/plateau-cesium'
import { SuspendUntilTilesLoaded } from '@takram/plateau-cesium-helpers'
import { LayersRenderer, useAddLayer } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'
import { AppFrame } from '@takram/plateau-ui-components'
import {
  BUILDING_LAYER,
  createViewLayer,
  layerComponents,
  PEDESTRIAN_LAYER
} from '@takram/plateau-view-layers'

import { AppHeader } from './containers/AppHeader'
import { AppOverlay } from './containers/AppOverlay'
import { Areas } from './containers/Areas'
import { Canvas } from './containers/Canvas'
import { Environments } from './containers/Environments'
import { KeyBindings } from './containers/KeyBindings'
import { Notifications } from './containers/Notifications'
import { PedestrianTool } from './containers/PedestrianTool'
import { ReverseGeocoding } from './containers/ReverseGeocoding'
import { ScreenSpaceCamera } from './containers/ScreenSpaceCamera'
import { ScreenSpaceSelection } from './containers/ScreenSpaceSelection'
import { SelectionBoundingSphere } from './containers/SelectionBoundingSphere'
import { SelectionCoordinator } from './containers/SelectionCoordinator'
import { Terrains } from './containers/Terrains'
import { ToolMachineEvents } from './containers/ToolMachineEvents'
import { readyAtom } from './states/app'

const initialDestination = Cartesian3.fromDegrees(139.755, 35.675, 1000)
const initialOrientation = new HeadingPitchRoll(Math.PI * 0.4, -Math.PI * 0.2)

// TODO: Just for temporary.
const InitialLayers: FC = () => {
  const addLayer = useAddLayer()

  useEffect(() => {
    const remove = [
      addLayer(
        createViewLayer({
          type: BUILDING_LAYER,
          municipalityCode: '13101',
          version: '2020',
          lod: 2,
          textured: false
        })
      ),
      addLayer(
        createViewLayer({
          type: BUILDING_LAYER,
          municipalityCode: '13102',
          version: '2020',
          lod: 2,
          textured: false
        })
      ),
      process.env.NODE_ENV !== 'production' &&
        addLayer(
          createViewLayer({
            type: PEDESTRIAN_LAYER,
            longitude: 139.769,
            latitude: 35.68
          })
        )
    ].filter(isNotFalse)
    return () => {
      remove.forEach(remove => {
        remove()
      })
    }
  }, [addLayer])

  return null
}

export interface PlateauViewProps {}

export const PlateauView: FC<PlateauViewProps> = () => {
  const setReady = useSetAtom(readyAtom)
  const handleTilesLoadComplete = useCallback(() => {
    setReady(true)
  }, [setReady])

  return (
    <AppFrame header={<AppHeader />}>
      <Canvas>
        <ScreenSpaceCamera tiltByRightButton />
        <CurrentTime hours={7} />
        <ViewLocator
          initialDestination={initialDestination}
          initialOrientation={initialOrientation}
        />
        <Suspense>
          <Environments />
        </Suspense>
        <Suspense>
          <Terrains />
        </Suspense>
        <Suspense>
          <SuspendUntilTilesLoaded
            initialTileCount={35}
            remainingTileCount={30}
            onComplete={handleTilesLoadComplete}
          >
            <LayersRenderer components={layerComponents} />
          </SuspendUntilTilesLoaded>
        </Suspense>
        <Areas />
        <ReverseGeocoding />
        <ToolMachineEvents />
        <PedestrianTool />
        <SelectionCoordinator />
        <SelectionBoundingSphere />
      </Canvas>
      <KeyBindings />
      <ScreenSpaceSelection />
      <AppOverlay />
      <Notifications />
      <InitialLayers />
    </AppFrame>
  )
}
