import {
  Divider,
  Popover,
  popoverClasses,
  styled,
  useTheme
} from '@mui/material'
import {
  anchorRef,
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import { useId, type FC, type ReactNode } from 'react'

import { SettingsIcon } from './icons'
import { InspectorHeader } from './InspectorHeader'
import { type ParameterItemProps } from './ParameterItem'
import { ParameterItemButton } from './ParameterItemButton'

const Content = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1)
}))

const StyledPopover = styled(Popover)(({ theme }) => ({
  [`& .${popoverClasses.paper}`]: {
    width: 320,
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    }
  }
}))

export interface GroupedParameterItemProps
  extends Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  content?: ReactNode
  children?: ReactNode
}

export const GroupedParameterItem: FC<GroupedParameterItemProps> = ({
  label,
  labelFontSize,
  description,
  content,
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
      <ParameterItemButton
        ref={anchorRef(popupState)}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        icon={<SettingsIcon />}
        {...bindTrigger(popupState)}
      />
      <Content>{content}</Content>
      <StyledPopover
        {...bindPopover(popupState)}
        anchorOrigin={{
          horizontal: parseFloat(theme.spacing(-1)),
          vertical: 'top'
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
      >
        <InspectorHeader title={label} onClose={popupState.close} />
        <Divider />
        {children}
      </StyledPopover>
    </>
  )
}
