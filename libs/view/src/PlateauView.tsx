import { Cartesian3, HeadingPitchRoll } from '@cesium/engine'
import { styled } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useCallback, useEffect, type FC } from 'react'

import { CurrentTime, ViewLocator } from '@takram/plateau-cesium'
import { SuspendUntilTilesLoaded } from '@takram/plateau-cesium-helpers'
import { GooglePhotorealisticTileset } from '@takram/plateau-datasets'
import { LayerList, LayersRenderer, useAddLayer } from '@takram/plateau-layers'
import {
  AppLayout,
  LayerList as LayerListComponent
} from '@takram/plateau-ui-components'
import {
  BUILDING_LAYER,
  ViewLayerListItem,
  createViewLayer,
  layerComponents
} from '@takram/plateau-view-layers'

import { Areas } from './containers/Areas'
import { Canvas } from './containers/Canvas'
import { Environments } from './containers/Environments'
import { ExclusiveSelection } from './containers/ExclusiveSelection'
import { KeyBindings } from './containers/KeyBindings'
import { ReverseGeocoding } from './containers/ReverseGeocoding'
import { ScreenSpaceCamera } from './containers/ScreenSpaceCamera'
import { ScreenSpaceSelection } from './containers/ScreenSpaceSelection'
import { SelectionBoundingSphere } from './containers/SelectionBoundingSphere'
import { Terrains } from './containers/Terrains'
import { ToolMachineEvents } from './containers/ToolMachineEvents'
import { DeveloperPanels } from './developer/DeveloperPanels'
import { LocationContextBar } from './panels/LocationContextBar'
import { MainPanel } from './panels/MainPanel'
import { Toolbar } from './panels/Toolbar'
import { environmentTypeAtom, readyAtom } from './states/app'

const initialDestination = Cartesian3.fromDegrees(139.755, 35.675, 1000)
const initialOrientation = new HeadingPitchRoll(Math.PI * 0.4, -Math.PI * 0.2)

const Root = styled('div')({
  touchAction: 'none' // TODO: Don't disable globally
})

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
      )
    ]
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

  const environmentType = useAtomValue(environmentTypeAtom)

  return (
    <Root>
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
        {environmentType !== 'google-photorealistic' ? (
          <Suspense>
            <SuspendUntilTilesLoaded
              initialTileCount={40}
              remainingTileCount={25}
              onComplete={handleTilesLoadComplete}
            >
              <LayersRenderer components={layerComponents} />
            </SuspendUntilTilesLoaded>
          </Suspense>
        ) : (
          <GooglePhotorealisticTileset
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_TILES_API_KEY}
          />
        )}
        <Areas />
        <ReverseGeocoding />
        <ToolMachineEvents />
        <SelectionBoundingSphere />
      </Canvas>
      <KeyBindings />
      <ScreenSpaceSelection />
      <ExclusiveSelection />
      <AppLayout
        main={
          <MainPanel>
            <LayerList
              component={LayerListComponent}
              itemComponent={ViewLayerListItem}
              unmountWhenEmpty
            />
          </MainPanel>
        }
        context={<LocationContextBar />}
        bottomLeft={<Toolbar />}
        developer={<DeveloperPanels />}
      />
      <InitialLayers />
    </Root>
  )
}
