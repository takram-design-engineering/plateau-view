import { IconButton, Popover, useTheme } from '@mui/material'
import {
  anchorRef,
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useId, type FC, type ReactNode } from 'react'

import { SettingsIcon } from './icons'
import { ParameterItem, type ParameterItemProps } from './ParameterItem'

export interface GroupedParameterItemProps
  extends Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  children?: ReactNode
}

export const GroupedParameterItem: FC<GroupedParameterItemProps> = ({
  label,
  labelFontSize,
  description,
  children
}) => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })

  const theme = useTheme()
  return (
    <>
      <ParameterItem
        ref={anchorRef(popupState)}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        control={
          <IconButton {...bindTrigger(popupState)}>
            <SettingsIcon />
          </IconButton>
        }
        controlSpace='button'
      />
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: parseFloat(theme.spacing(-2)),
          vertical: 'top'
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
      >
        {children}
      </Popover>
    </>
  )
}
