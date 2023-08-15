import { FrameRateMonitor, type Scene } from '@cesium/engine'
import DrawCommand from '@cesium/engine/Source/Renderer/DrawCommand'
import { Divider, Stack, styled } from '@mui/material'
import { useResetAtom } from 'jotai/utils'
import { sumBy } from 'lodash'
import { useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useCesium, useInstance, usePreRender } from '@takram/plateau-cesium'
import {
  showTilesetBoundingVolumeAtom,
  showTilesetWireframeAtom
} from '@takram/plateau-datasets'
import { atomWithResettableAtoms } from '@takram/plateau-shared-states'
import { assertType } from '@takram/plateau-type-helpers'
import {
  DeveloperPanel,
  ParameterItem,
  ParameterList,
  SwitchParameterItem
} from '@takram/plateau-ui-components'

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

const resetAtom = atomWithResettableAtoms([
  showGlobeWireframeAtom,
  showTilesetWireframeAtom,
  showTilesetBoundingVolumeAtom
])

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

    assertType<PrivateScene>(scene)
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

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='Performance' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <ParameterItem
            labelFontSize='small'
            label='Frame Rate'
            control={<Value ref={frameRateRef} />}
          />
          <ParameterItem
            labelFontSize='small'
            label='Number of Draw Calls'
            control={<Value ref={drawCountRef} />}
          />
          <ParameterItem
            labelFontSize='small'
            label='Number of Vertices'
            control={<Value ref={vertexCountRef} />}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            labelFontSize='small'
            label='Show Globe Wireframe'
            atom={showGlobeWireframeAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Show Tileset Wireframe'
            atom={showTilesetWireframeAtom}
          />
          <SwitchParameterItem
            labelFontSize='small'
            label='Show Tileset Bounding Volume'
            atom={showTilesetBoundingVolumeAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
