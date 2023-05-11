import {
  Stack,
  ToggleButton,
  Tooltip,
  type ToggleButtonProps
} from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { forwardRef, useCallback, type FC } from 'react'

import {
  FloatingButton,
  FloatingToolbar,
  HandToolIcon,
  PedestrianToolIcon,
  SelectToolIcon,
  SettingsIcon,
  ShortcutTooltip,
  SketchToolIcon,
  StoryToolIcon,
  TimelineIcon,
  type ShortcutTooltipProps
} from '@plateau/ui-components'

import { platformAtom } from '../states/app'
import { toolAtom, toolMachineAtom, type Tool } from '../states/tool'
import { type EventObject } from '../states/toolMachine'

export const ToolbarItem = forwardRef<
  HTMLButtonElement,
  ToggleButtonProps & Omit<ShortcutTooltipProps, 'children'>
>(({ title, shortcutKey, ...props }, ref) => {
  const platform = useAtomValue(platformAtom)
  return (
    <ShortcutTooltip
      title={title}
      platform={platform}
      shortcutKey={shortcutKey}
    >
      <ToggleButton ref={ref} {...props} />
    </ShortcutTooltip>
  )
})

const eventTypes: Record<Tool, EventObject['type']> = {
  hand: 'HAND',
  select: 'SELECT',
  sketch: 'SKETCH',
  story: 'STORY',
  pedestrian: 'PEDESTRIAN'
}

export const Toolbar: FC = () => {
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

  // TODO: Introduce icons.
  return (
    <Stack direction='row' spacing={1}>
      <FloatingToolbar value={tool} onChange={handleChange}>
        <ToolbarItem value='hand' title='移動' shortcutKey='H'>
          <HandToolIcon fontSize='large' />
        </ToolbarItem>
        <ToolbarItem value='select' title='選択' shortcutKey='V'>
          <SelectToolIcon fontSize='large' />
        </ToolbarItem>
        <ToolbarItem value='sketch' title='作図' shortcutKey='G'>
          <SketchToolIcon fontSize='large' />
        </ToolbarItem>
        <ToolbarItem value='story' title='ストーリー' shortcutKey='T'>
          <StoryToolIcon fontSize='large' />
        </ToolbarItem>
        <ToolbarItem value='pedestrian' title='歩行者視点' shortcutKey='P'>
          <PedestrianToolIcon fontSize='large' />
        </ToolbarItem>
      </FloatingToolbar>
      <Tooltip title='設定'>
        <FloatingButton>
          <SettingsIcon fontSize='large' />
        </FloatingButton>
      </Tooltip>
      <Tooltip title='タイムライン'>
        <FloatingButton>
          <TimelineIcon fontSize='large' />
        </FloatingButton>
      </Tooltip>
    </Stack>
  )
}
