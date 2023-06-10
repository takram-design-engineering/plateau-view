import {
  Stack,
  ToggleButton,
  Tooltip,
  styled,
  type ToggleButtonProps
} from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { forwardRef, useCallback, useId, type FC } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'
import {
  FloatingButton,
  FloatingToolbar,
  HandToolIcon,
  OverlayPopover,
  PedestrianToolIcon,
  SelectToolIcon,
  SettingsIcon,
  ShortcutTooltip,
  SketchToolIcon,
  StoryToolIcon,
  TimelineIcon,
  type ShortcutTooltipProps
} from '@takram/plateau-ui-components'

import { toolAtom, toolMachineAtom, type Tool } from '../states/tool'
import { type EventObject } from '../states/toolMachine'
import { DateControlPanel } from './DateControlPanel'
import { SettingsPanel } from './SettingsPanel'

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

  const id = useId()
  const settingsPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}:settings`
  })
  const dateControlPopupState = usePopupState({
    variant: 'popover',
    popupId: `${id}:dateControl`
  })

  const settingsPopoverProps = bindPopover(settingsPopupState)
  const dateControlPopoverProps = bindPopover(dateControlPopupState)

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
        <FloatingButton
          selected={settingsPopoverProps.open}
          aria-label='設定'
          {...bindTrigger(settingsPopupState)}
        >
          <SettingsIcon fontSize='medium' />
        </FloatingButton>
      </Tooltip>
      <OverlayPopover {...settingsPopoverProps}>
        <SettingsPanel />
      </OverlayPopover>
      <Tooltip title='日時'>
        <FloatingButton
          selected={dateControlPopoverProps.open}
          aria-label='日時'
          {...bindTrigger(dateControlPopupState)}
        >
          <TimelineIcon fontSize='medium' />
        </FloatingButton>
      </Tooltip>
      <OverlayPopover {...dateControlPopoverProps}>
        <DateControlPanel />
      </OverlayPopover>
    </Stack>
  )
}
