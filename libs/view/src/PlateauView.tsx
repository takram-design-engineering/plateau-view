import {
  Cartesian3,
  Color,
  ScreenSpaceEventType,
  type CameraEventAggregator,
  type Cartesian2,
  type ScreenSpaceCameraController
} from '@cesium/engine'
import { styled, useTheme } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type FC
} from 'react'

import {
  CurrentTime,
  ViewLocator,
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@plateau/cesium'
import { SuspendUntilTilesLoaded } from '@plateau/cesium-helpers'
import { PlateauDatasetsContext } from '@plateau/datasets'
import { useWindowEvent } from '@plateau/react-helpers'
import {
  ScreenSpaceSelectionBoundingSphere,
  ScreenSpaceSelectionContext
} from '@plateau/screen-space-selection'
import { AppLayout } from '@plateau/ui-components'

import { Areas } from './containers/Areas'
import { Canvas } from './containers/Canvas'
import { Environments } from './containers/Environments'
import { ScreenSpaceCamera } from './containers/ScreenSpaceCamera'
import { ScreenSpaceSelection } from './containers/ScreenSpaceSelection'
import { Terrains } from './containers/Terrains'
import { IsomorphicTokyo23BuildingTileset } from './datasets/IsomorphicTokyo23BuildingTileset'
import { DeveloperPanels } from './developer/DeveloperPanels'
import { useReverseGeocoder } from './hooks/useReverseGeocoder'
import { LocationContextBar } from './panels/LocationContextBar'
import { MainPanel } from './panels/MainPanel'
import { SelectionPanel } from './panels/SelectionPanel'
import { Toolbar } from './panels/Toolbar'
import { addressAtom } from './states/address'
import {
  colorModeAtom,
  readyAtom,
  showSelectionBoundingSphereAtom
} from './states/app'
import { toolAtom, toolMachineAtom } from './states/tool'

const initialView = Cartesian3.fromDegrees(139.765, 35.68, 8000)

const Root = styled('div')({
  touchAction: 'none' // TODO: Don't disable globally
})

// TODO: Settle into appropriate component.
const Events: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  const tool = useAtomValue(toolAtom)
  const scene = useCesium(({ scene }) => scene)

  // Stop inertial movements when switching between tools. There're no such
  // public methods to do so, so I'm accessing private API.
  useEffect(() => {
    // Private API
    const controller =
      scene.screenSpaceCameraController as ScreenSpaceCameraController & {
        _aggregator: CameraEventAggregator & {
          _lastMovement: Record<
            string,
            {
              startPosition: Cartesian2
              endPosition: Cartesian2
            }
          >
        }
      }
    Object.values(controller._aggregator._lastMovement).forEach(
      ({ startPosition, endPosition }) => {
        startPosition.x = 0
        startPosition.y = 0
        endPosition.x = 0
        endPosition.y = 0
      }
    )
  }, [tool, scene])

  useWindowEvent('keydown', event => {
    if (event.repeat) {
      return
    }
    if (
      event.code === 'Space' &&
      !event.altKey &&
      !event.shiftKey &&
      !event.metaKey &&
      !event.ctrlKey
    ) {
      send({ type: 'PRESS_SPACE' })
    } else if (event.key === 'Meta') {
      send({ type: 'PRESS_COMMAND' })
    }
  })
  useWindowEvent('keyup', event => {
    if (event.code === 'Space') {
      send({ type: 'RELEASE_SPACE' })
    } else if (event.key === 'Meta') {
      send({ type: 'RELEASE_COMMAND' })
    }
  })
  useWindowEvent('blur', () => {
    send({ type: 'WINDOW_BLUR' })
  })

  const eventHandler = useScreenSpaceEventHandler()
  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_DOWN, () => {
    send({ type: 'MOUSE_DOWN' })
  })
  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_UP, () => {
    send({ type: 'MOUSE_UP' })
  })
  return null
}

// TODO: Settle into appropriate component.
const CanvasPointer: FC = () => {
  const canvas = useCesium(({ canvas }) => canvas)
  const state = useAtomValue(toolMachineAtom)
  let cursor
  if (
    state.matches('activeTool.modal.hand') ||
    state.matches('activeTool.momentary.hand')
  ) {
    cursor = 'grabbing'
  } else if (
    state.matches('selectedTool.modal.hand') ||
    state.matches('selectedTool.momentary.hand')
  ) {
    cursor = 'grab'
  } else {
    cursor = 'auto'
  }
  canvas.style.cursor = cursor
  return null
}

// TODO: Settle into appropriate component.
const KeyBindings: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  useWindowEvent('keydown', event => {
    if (document.activeElement !== document.body) {
      return
    }
    if (event.altKey || event.shiftKey || event.metaKey || event.ctrlKey) {
      return
    }
    switch (event.key) {
      case 'v':
        send({ type: 'SELECT' })
        break
      case 'h':
        send({ type: 'HAND' })
        break
      case 'g':
        send({ type: 'SKETCH' })
        break
      case 't':
        send({ type: 'STORY' })
        break
      case 'p':
        send({ type: 'PEDESTRIAN' })
        break
    }
  })
  return null
}

// TODO: Settle into appropriate component.
const ReverseGeocoder: FC = () => {
  const address = useReverseGeocoder()
  const setAddress = useSetAtom(addressAtom)
  const ready = useAtomValue(readyAtom)
  useEffect(() => {
    if (ready) {
      setAddress(address ?? null)
    }
  }, [address, setAddress, ready])
  return null
}

// TODO: Settle into appropriate component.
const SyncColorMode: FC = () => {
  const colorMode = useAtomValue(colorModeAtom)
  const setPlateauDatasetsColorMode = useSetAtom(
    useContext(PlateauDatasetsContext).colorModeAtom
  )
  const setScreenSpaceSelectionColorMode = useSetAtom(
    useContext(ScreenSpaceSelectionContext).colorModeAtom
  )
  useEffect(() => {
    setPlateauDatasetsColorMode(colorMode)
    setScreenSpaceSelectionColorMode(colorMode)
  }, [colorMode, setPlateauDatasetsColorMode, setScreenSpaceSelectionColorMode])
  return null
}

// TODO: Settle into appropriate component.
const SelectionBoundingSphere: FC = () => {
  const show = useAtomValue(showSelectionBoundingSphereAtom)
  const theme = useTheme()
  const color = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main),
    [theme]
  )
  return show ? <ScreenSpaceSelectionBoundingSphere color={color} /> : null
}

export interface PlateauViewProps {}

export const PlateauView: FC<PlateauViewProps> = () => {
  const setReady = useSetAtom(readyAtom)
  const handleTilesLoadComplete = useCallback(() => {
    setReady(true)
  }, [setReady])

  return (
    <Root>
      <Canvas>
        <ScreenSpaceCamera tiltByRightButton />
        <CurrentTime hours={7} />
        <ViewLocator initialView={initialView} />
        <Suspense>
          <Environments />
        </Suspense>
        <Suspense>
          <Terrains />
        </Suspense>
        <Suspense>
          <SuspendUntilTilesLoaded
            initialTileCount={40}
            remainingTileCount={25}
            onComplete={handleTilesLoadComplete}
          >
            <IsomorphicTokyo23BuildingTileset name='13101_chiyoda-ku' />
            <IsomorphicTokyo23BuildingTileset name='13102_chuo-ku' />
          </SuspendUntilTilesLoaded>
        </Suspense>
        <Areas />
        <Events />
        <CanvasPointer />
        <KeyBindings />
        <ReverseGeocoder />
        <SelectionBoundingSphere />
      </Canvas>
      <ScreenSpaceSelection />
      <SyncColorMode />
      <AppLayout
        main={<MainPanel />}
        context={<LocationContextBar />}
        aside={<SelectionPanel />}
        bottomLeft={<Toolbar />}
        developer={<DeveloperPanels />}
      />
    </Root>
  )
}
