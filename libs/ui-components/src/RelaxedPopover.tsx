import {
  ClickAwayListener,
  Popover,
  popoverClasses,
  styled,
  type PopoverProps
} from '@mui/material'
import { useCallback, type FC } from 'react'

const StyledPopover = styled(Popover)({
  pointerEvents: 'none',
  [`& .${popoverClasses.paper}`]: {
    pointerEvents: 'auto'
  }
})

export interface RelaxedPopoverProps extends PopoverProps {}

export const RelaxedPopover: FC<RelaxedPopoverProps> = ({
  onClose,
  children,
  ...props
}) => {
  // Relaxed behavior to close popover by clicking outside.
  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      onClose?.(event, 'backdropClick')
    },
    [onClose]
  )
  const handleClose: NonNullable<PopoverProps['onClose']> = useCallback(
    (event, reason) => {
      if (reason !== 'backdropClick') {
        onClose?.(event, reason)
      }
    },
    [onClose]
  )
  return (
    <StyledPopover {...props} onClose={handleClose}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>{children}</div>
      </ClickAwayListener>
    </StyledPopover>
  )
}
