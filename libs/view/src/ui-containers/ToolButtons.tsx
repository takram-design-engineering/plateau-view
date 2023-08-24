import { Typography } from '@mui/material'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, type FC } from 'react'

import { type GeometryType } from '@takram/plateau-sketch'
import {
  AppToggleButton,
  AppToggleButtonGroup,
  HandIcon,
  PedestrianIcon,
  PointerArrowIcon,
  SketchIcon,
  Space,
  StoryIcon
} from '@takram/plateau-ui-components'

import {
  sketchTypeAtom,
  toolAtom,
  toolMachineAtom,
  type Tool
} from '../states/tool'
import { type EventObject } from '../states/toolMachine'

const eventTypes: Record<Tool, EventObject['type']> = {
  hand: 'HAND',
  select: 'SELECT',
  sketch: 'SKETCH',
  story: 'STORY',
  pedestrian: 'PEDESTRIAN'
}

export const ToolButtons: FC = () => {
  const send = useSetAtom(toolMachineAtom)
  const tool = useAtomValue(toolAtom)

  const handleChange = useCallback(
    (event: unknown, value: Tool | null) => {
      if (value != null) {
        send({ type: eventTypes[value] })
      }
    },
    [send]
  )

  const [sketchType, setSketchType] = useAtom(sketchTypeAtom)
  const handleSketchTypeChange = useCallback(
    (event: unknown, value: GeometryType | null) => {
      if (value != null) {
        setSketchType(value)
      }
    },
    [setSketchType]
  )

  return (
    <>
      <AppToggleButtonGroup value={tool} onChange={handleChange}>
        <AppToggleButton value='hand' title='移動' shortcutKey='H'>
          <HandIcon fontSize='medium' />
        </AppToggleButton>
        <AppToggleButton value='select' title='選択' shortcutKey='V'>
          <PointerArrowIcon fontSize='medium' />
        </AppToggleButton>
        <AppToggleButton value='pedestrian' title='歩行者視点' shortcutKey='P'>
          <PedestrianIcon fontSize='medium' />
        </AppToggleButton>
        <AppToggleButton value='sketch' title='作図' shortcutKey='G'>
          <SketchIcon fontSize='medium' />
        </AppToggleButton>
        <AppToggleButton
          value='story'
          title='ストーリー'
          shortcutKey='T'
          disabled
        >
          <StoryIcon fontSize='medium' />
        </AppToggleButton>
      </AppToggleButtonGroup>
      {tool === 'sketch' && (
        <>
          <Space />
          <AppToggleButtonGroup
            value={sketchType}
            onChange={handleSketchTypeChange}
          >
            <AppToggleButton value='circle' title='Circle'>
              <Typography variant='body2'>Circle</Typography>
            </AppToggleButton>
            <AppToggleButton value='rectangle' title='Rect'>
              <Typography variant='body2'>Rect</Typography>
            </AppToggleButton>
            <AppToggleButton value='polygon' title='Polygon'>
              <Typography variant='body2'>Polygon</Typography>
            </AppToggleButton>
          </AppToggleButtonGroup>
        </>
      )}
    </>
  )
}
