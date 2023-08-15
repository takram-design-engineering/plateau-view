import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useId, type FC } from 'react'

import {
  AppIconButton,
  OverlayPopper,
  SettingsIcon
} from '@takram/plateau-ui-components'

import { SettingsPanel } from './SettingsPanel'

export const SettingsButton: FC = () => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const popoverProps = bindPopover(popupState)

  return (
    <>
      <AppIconButton
        title='設定'
        selected={popoverProps.open}
        disableTooltip={popoverProps.open}
        {...bindTrigger(popupState)}
      >
        <SettingsIcon />
      </AppIconButton>
      <OverlayPopper {...popoverProps} inset={1.5}>
        <SettingsPanel />
      </OverlayPopper>
    </>
  )
}
