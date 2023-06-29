import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useId, type FC } from 'react'

import {
  AppIconButton,
  OverlayPopover,
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
        {...bindTrigger(popupState)}
      >
        <SettingsIcon />
      </AppIconButton>
      <OverlayPopover {...popoverProps} placement='bottom' inset={2}>
        <SettingsPanel />
      </OverlayPopover>
    </>
  )
}
