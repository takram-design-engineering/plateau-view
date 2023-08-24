import { Cartesian3, HeadingPitchRoll } from '@cesium/engine'
import { useSetAtom } from 'jotai'
import { Suspense, useCallback, type FC } from 'react'

import {
  CurrentTime,
  SuspendUntilTilesLoaded,
  ViewLocator
} from '@takram/plateau-cesium'
import { LayersRenderer } from '@takram/plateau-layers'
import { AppFrame } from '@takram/plateau-ui-components'
import { layerComponents } from '@takram/plateau-view-layers'

import { Areas } from './containers/Areas'
import { Canvas } from './containers/Canvas'
import { Environments } from './containers/Environments'
import { FileDrop } from './containers/FileDrop'
import { InitialLayers } from './containers/InitialLayers'
import { KeyBindings } from './containers/KeyBindings'
import { Notifications } from './containers/Notifications'
import { PedestrianTool } from './containers/PedestrianTool'
import { ReverseGeocoding } from './containers/ReverseGeocoding'
import { ScreenSpaceCamera } from './containers/ScreenSpaceCamera'
import { ScreenSpaceSelection } from './containers/ScreenSpaceSelection'
import { SelectionBoundingSphere } from './containers/SelectionBoundingSphere'
import { SelectionCoordinator } from './containers/SelectionCoordinator'
import { SketchTool } from './containers/SketchTool'
import { Terrains } from './containers/Terrains'
import { ToolMachineEvents } from './containers/ToolMachineEvents'
import { readyAtom } from './states/app'
import { AppHeader } from './ui-containers/AppHeader'
import { AppOverlay } from './ui-containers/AppOverlay'

const initialDestination = Cartesian3.fromDegrees(139.755, 35.675, 1000)
const initialOrientation = new HeadingPitchRoll(Math.PI * 0.4, -Math.PI * 0.2)

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
        <SketchTool />
        <SelectionCoordinator />
        <SelectionBoundingSphere />
      </Canvas>
      <KeyBindings />
      <ScreenSpaceSelection />
      <FileDrop />
      <AppOverlay />
      <Notifications />
      <InitialLayers />
    </AppFrame>
  )
}
