import {
  Stack,
  ToggleButton,
  Tooltip,
  styled,
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
} from '@takram/plateau-ui-components'

import { platformAtom } from '../states/app'
import { toolAtom, toolMachineAtom, type Tool } from '../states/tool'
import { type EventObject } from '../states/toolMachine'

const TooltipContent = styled('div')({
  display: 'inline-flex',
  height: '100%'
})

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
      <TooltipContent>
        <ToggleButton ref={ref} aria-label={title} {...props} />
      </TooltipContent>
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
          <HandToolIcon fontSize='medium' />
        </ToolbarItem>
        <ToolbarItem value='select' title='選択' shortcutKey='V'>
          <SelectToolIcon fontSize='medium' />
        </ToolbarItem>
        <ToolbarItem value='sketch' title='作図' shortcutKey='G' disabled>
          <SketchToolIcon fontSize='medium' />
        </ToolbarItem>
        <ToolbarItem value='story' title='ストーリー' shortcutKey='T' disabled>
          <StoryToolIcon fontSize='medium' />
        </ToolbarItem>
        <ToolbarItem
          value='pedestrian'
          title='歩行者視点'
          shortcutKey='P'
          disabled
        >
          <PedestrianToolIcon fontSize='medium' />
        </ToolbarItem>
      </FloatingToolbar>
      <Tooltip title='設定'>
        <span>
          <FloatingButton aria-label='設定' disabled>
            <SettingsIcon fontSize='medium' />
          </FloatingButton>
        </span>
      </Tooltip>
      <Tooltip title='タイムライン'>
        <span>
          <FloatingButton aria-label='タイムライン' disabled>
            <TimelineIcon fontSize='medium' />
          </FloatingButton>
        </span>
      </Tooltip>
    </Stack>
  )
}
