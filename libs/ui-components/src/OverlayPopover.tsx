import {
  ClickAwayListener,
  Fade,
  Popover,
  popoverClasses,
  styled,
  type PopoverProps
} from '@mui/material'
import { useCallback, type FC } from 'react'

const Root = styled(Popover, {
  shouldForwardProp: prop => prop !== 'placement'
})<{
  placement: 'top' | 'bottom'
}>(({ theme, placement }) => ({
  pointerEvents: 'none',
  [`& .${popoverClasses.paper}`]: {
    overflow: 'visible',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    pointerEvents: 'auto',
    ...(placement === 'top' && {
      paddingBottom: theme.spacing(1)
    }),
    ...(placement === 'bottom' && {
      paddingTop: theme.spacing(1)
    })
  }
}))

export interface OverlayPopoverProps extends PopoverProps {
  placement?: 'top' | 'bottom'
  pinned?: boolean
  children: JSX.Element
}

export const OverlayPopover: FC<OverlayPopoverProps> = ({
  placement = 'top',
  pinned = false,
  onClose,
  children,
  ...props
}) => {
  // Relaxed behavior to close popover by clicking outside.
  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!pinned) {
        onClose?.(event, 'backdropClick')
      }
    },
    [onClose, pinned]
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
    <Root
      onClose={handleClose}
      anchorOrigin={{
        vertical: placement === 'top' ? 'top' : 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: placement === 'top' ? 'bottom' : 'top',
        horizontal: 'center'
      }}
      TransitionComponent={Fade}
      transitionDuration={0}
      {...props}
      placement={placement}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>{children}</div>
      </ClickAwayListener>
    </Root>
  )
}
