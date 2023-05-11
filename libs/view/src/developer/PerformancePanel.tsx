import { FrameRateMonitor, type Scene } from '@cesium/engine'
import DrawCommand from '@cesium/engine/Source/Renderer/DrawCommand'
import { Divider, Stack, styled } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import { sumBy } from 'lodash'
import { useContext, useMemo, useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@plateau/cesium'
import { PlateauDatasetsContext } from '@plateau/datasets'
import {
  DeveloperPanel,
  ParameterItem,
  ParameterList,
  SwitchParameterItem
} from '@plateau/ui-components'

import { atomWithResettableAtoms } from '../states/atomWithResettableAtoms'
import { showGlobeWireframeAtom } from '../states/performance'

interface PrivateScene extends Scene {
  view: {
    frustumCommandsList: ReadonlyArray<{
      commands: ReadonlyArray<
        ReadonlyArray<{
          vertexArray?: {
            numberOfVertices: number
          }
        }>
      >
      indices: readonly number[]
    }>
  }
}

const Value = styled('span')(({ theme }) => ({
  ...theme.typography.body2,
  fontVariantNumeric: 'tabular-nums'
}))

export const PerformancePanel: FC = () => {
  const frameRateRef = useRef<HTMLSpanElement>(null)
  const drawCountRef = useRef<HTMLSpanElement>(null)
  const vertexCountRef = useRef<HTMLSpanElement>(null)

  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const frameRateMonitor = useInstance({
    keys: [scene],
    create: () => (scene != null ? new FrameRateMonitor({ scene }) : undefined)
  })

  usePreRender(scene => {
    invariant(frameRateRef.current != null)
    invariant(drawCountRef.current != null)
    invariant(vertexCountRef.current != null)

    if (frameRateMonitor != null) {
      frameRateRef.current.textContent =
        frameRateMonitor.lastFramesPerSecond != null
          ? `${frameRateMonitor.lastFramesPerSecond.toFixed(1)}${
              scene.requestRenderMode ? ' (Throttled)' : ''
            }`
          : 'Measuring...'
    }

    invariant(((scene): scene is PrivateScene => true)(scene))
    const view = scene.view
    const frustumCommandsList = view.frustumCommandsList

    drawCountRef.current.textContent = sumBy(
      frustumCommandsList,
      ({ commands, indices }) =>
        commands.reduce(
          (sum, commands, index) =>
            sum +
            sumBy(commands.slice(0, indices[index]), command =>
              command.constructor.name === DrawCommand.name ? 1 : 0
            ),
          0
        )
    ).toLocaleString()

    vertexCountRef.current.textContent = sumBy(
      frustumCommandsList,
      ({ commands, indices }) =>
        commands.reduce(
          (sum, commands, index) =>
            sum +
            sumBy(
              commands.slice(0, indices[index]),
              command => command.vertexArray?.numberOfVertices ?? 0
            ),
          0
        )
    ).toLocaleString()
  })

  const {
    showWireframeAtom: showTilesetWireframeAtom,
    showBoundingVolumeAtom: showTilesetBoundingVolumeAtom
  } = useContext(PlateauDatasetsContext)

  const resetAtom = useMemo(
    () =>
      atomWithResettableAtoms([
        showGlobeWireframeAtom,
        showTilesetWireframeAtom,
        showTilesetBoundingVolumeAtom
      ]),
    [showTilesetWireframeAtom, showTilesetBoundingVolumeAtom]
  )
  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='Performance' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <ParameterItem
            label='Frame Rate'
            control={<Value ref={frameRateRef} />}
          />
          <ParameterItem
            label='Number of Draw Calls'
            control={<Value ref={drawCountRef} />}
          />
          <ParameterItem
            label='Number of Vertices'
            control={<Value ref={vertexCountRef} />}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            label='Show Globe Wireframe'
            atom={showGlobeWireframeAtom}
          />
          <SwitchParameterItem
            label='Show Tileset Wireframe'
            atom={showTilesetWireframeAtom}
          />
          <SwitchParameterItem
            label='Show Tileset Bounding Volume'
            atom={showTilesetBoundingVolumeAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
