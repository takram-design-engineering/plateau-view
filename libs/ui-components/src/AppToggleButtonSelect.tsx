import { alpha, IconButton, Stack, styled, Typography } from '@mui/material'
import {
  anchorRef,
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import {
  useCallback,
  useId,
  type FC,
  type MouseEvent,
  type ReactNode
} from 'react'

import { AppToggleButton, type AppToggleButtonProps } from './AppToggleButton'
import { FloatingPanel } from './FloatingPanel'
import { DropDownIcon } from './icons'
import { OverlayPopper } from './OverlayPopper'
import { SelectItem, type SelectItemProps } from './SelectItem'

const StyledButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(-1.5),
  marginLeft: -2,
  padding: 0,
  color: alpha(theme.palette.text.primary, 0.5),
  '&&': {
    minWidth: 0
  },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent'
  }
}))

const StyledSelectItem = styled(SelectItem)(({ theme }) => ({
  '&:first-of-type': {
    marginTop: theme.spacing(1)
  },
  '&:last-of-type': {
    marginBottom: theme.spacing(1)
  }
})) as typeof SelectItem // For generics

export interface AppToggleButtonSelectItem {
  value: string
  title: string
  icon: ReactNode
}

const Item: FC<
  SelectItemProps &
    AppToggleButtonSelectItem & {
      selectedItem?: string
    }
> = ({ title, icon, selectedItem, ...props }) => (
  <StyledSelectItem {...props}>
    <Stack direction='row' spacing={1} alignItems='center'>
      {icon}
      <Typography variant='body1'>{title}</Typography>
    </Stack>
  </StyledSelectItem>
)

export interface AppToggleButtonSelectProps
  extends Omit<AppToggleButtonProps, 'children'> {
  items: AppToggleButtonSelectItem[]
  selectedValue: string
  onValueChange?: (event: MouseEvent, value: string) => void
}

export const AppToggleButtonSelect: FC<AppToggleButtonSelectProps> = ({
  items,
  selectedValue,
  onValueChange,
  ...props
}) => {
  const id = useId()
  const popupState = usePopupState({
    variant: 'popover',
    popupId: id
  })
  const buttonProps = bindTrigger(popupState)
  const popoverProps = bindPopover(popupState)

  const { onClick } = buttonProps
  const handleClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      onClick(event)
    },
    [onClick]
  )

  const { close } = popupState
  const handleItemClick = useCallback(
    (event: MouseEvent) => {
      const value = event.currentTarget.getAttribute('value')
      if (value != null) {
        onValueChange?.(event, value)
        close()
      }
    },
    [onValueChange, close]
  )

  return (
    <>
      <AppToggleButton
        {...props}
        component='div'
        title={!popoverProps.open ? props.title : undefined}
        ref={anchorRef(popupState)}
      >
        {items.find(({ value }) => value === selectedValue)?.icon}
        <StyledButton {...bindTrigger(popupState)} onClick={handleClick}>
          <DropDownIcon />
        </StyledButton>
      </AppToggleButton>
      <OverlayPopper {...popoverProps} inset={1.5}>
        <FloatingPanel>
          {items.map(item => (
            <Item
              key={item.value}
              {...item}
              selected={item.value === selectedValue}
              onClick={handleItemClick}
            />
          ))}
        </FloatingPanel>
      </OverlayPopper>
    </>
  )
}
