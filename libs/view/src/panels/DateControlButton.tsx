import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useId, type FC } from 'react'

import {
  AppIconButton,
  OverlayPopover,
  TimelineIcon
} from '@takram/plateau-ui-components'

import { DateControlPanel } from './DateControlPanel'

export const DateControlButton: FC = () => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const popoverProps = bindPopover(popupState)

  return (
    <>
      <AppIconButton
        title='日時'
        selected={popoverProps.open}
        disableTooltip={popoverProps.open}
        {...bindTrigger(popupState)}
      >
        <TimelineIcon />
      </AppIconButton>
      <OverlayPopover {...popoverProps} inset={1.5}>
        <DateControlPanel />
      </OverlayPopover>
    </>
  )
}
