import { Stack, Tooltip } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useCallback, useId, type FC } from 'react'

import {
  FloatingButton,
  FloatingToolbar,
  FloatingToolbarItem,
  HandIcon,
  OverlayPopover,
  PedestrianIcon,
  PointerArrowIcon,
  SettingsIcon,
  SketchIcon,
  StoryIcon,
  TimelineIcon
} from '@takram/plateau-ui-components'

import { toolAtom, toolMachineAtom, type Tool } from '../states/tool'
import { type EventObject } from '../states/toolMachine'
import { DateControlPanel } from './DateControlPanel'
import { SettingsPanel } from './SettingsPanel'

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

  return (
    <Stack direction='row' spacing={1}>
      <FloatingToolbar value={tool} onChange={handleChange}>
        <FloatingToolbarItem value='hand' title='移動' shortcutKey='H'>
          <HandIcon fontSize='medium' />
        </FloatingToolbarItem>
        <FloatingToolbarItem value='select' title='選択' shortcutKey='V'>
          <PointerArrowIcon fontSize='medium' />
        </FloatingToolbarItem>
        <FloatingToolbarItem
          value='sketch'
          title='作図'
          shortcutKey='G'
          disabled
        >
          <SketchIcon fontSize='medium' />
        </FloatingToolbarItem>
        <FloatingToolbarItem
          value='story'
          title='ストーリー'
          shortcutKey='T'
          disabled
        >
          <StoryIcon fontSize='medium' />
        </FloatingToolbarItem>
        <FloatingToolbarItem
          value='pedestrian'
          title='歩行者視点'
          shortcutKey='P'
        >
          <PedestrianIcon fontSize='medium' />
        </FloatingToolbarItem>
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
