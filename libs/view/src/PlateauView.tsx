import { Cartesian3, HeadingPitchRoll } from '@cesium/engine'
import { atom, useSetAtom, type PrimitiveAtom } from 'jotai'
import { Suspense, useCallback, useMemo, type FC } from 'react'

import {
  CurrentTime,
  SuspendUntilTilesLoaded,
  ViewLocator
} from '@takram/plateau-cesium'
import { LayersRenderer } from '@takram/plateau-layers'
import { AppFrame } from '@takram/plateau-ui-components'
import { layerComponents } from '@takram/plateau-view-layers'

import { Areas } from './containers/Areas'
import { AutoRotateCamera } from './containers/AutoRotateCamera'
import { Canvas } from './containers/Canvas'
import { Environments } from './containers/Environments'
import { HighlightedAreas } from './containers/HighlightedAreas'
import { InitialLayers } from './containers/InitialLayers'
import { KeyBindings } from './containers/KeyBindings'
import { PedestrianTool } from './containers/PedestrianTool'
import { ReverseGeocoding } from './containers/ReverseGeocoding'
import { ScreenSpaceCamera } from './containers/ScreenSpaceCamera'
import { ScreenSpaceSelection } from './containers/ScreenSpaceSelection'
import { SelectionBoundingSphere } from './containers/SelectionBoundingSphere'
import { SelectionCoordinator } from './containers/SelectionCoordinator'
import { SketchTool } from './containers/SketchTool'
import { Terrains } from './containers/Terrains'
import { ToolMachineEvents } from './containers/ToolMachineEvents'
import { MapLabel } from './containers/VectorMapLabel'
import { ViewportObserver } from './containers/ViewportObserver'
import { readyAtom } from './states/app'
import { AppHeader } from './ui-containers/AppHeader'
import { AppOverlay } from './ui-containers/AppOverlay'
import { FileDrop } from './ui-containers/FileDrop'
import { Notifications } from './ui-containers/Notifications'

const initialDestination = Cartesian3.fromDegrees(139.755, 35.675, 1000)
const initialOrientation = new HeadingPitchRoll(Math.PI * 0.4, -Math.PI * 0.2)

export interface PlateauViewProps {
  readyAtom?: PrimitiveAtom<boolean>
}

export const PlateauView: FC<PlateauViewProps> = ({
  readyAtom: readyAtomProp
}) => {
  const setReady = useSetAtom(
    useMemo(
      () =>
        atom(null, (get, set, value: boolean) => {
          set(readyAtom, value)
          if (readyAtomProp != null) {
            set(readyAtomProp, value)
          }
        }),
      [readyAtomProp]
    )
  )
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
            <MapLabel />
          </SuspendUntilTilesLoaded>
        </Suspense>
        <Areas />
        <HighlightedAreas />
        <ReverseGeocoding />
        <ToolMachineEvents />
        <PedestrianTool />
        <SketchTool />
        <SelectionCoordinator />
        <SelectionBoundingSphere />
        <AutoRotateCamera />
      </Canvas>
      <KeyBindings />
      <ScreenSpaceSelection />
      <FileDrop />
      <ViewportObserver />
      <AppOverlay />
      <Notifications />
      <InitialLayers />
    </AppFrame>
  )
}
