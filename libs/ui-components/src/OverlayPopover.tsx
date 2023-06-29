import {
  ClickAwayListener,
  Popover,
  popoverClasses,
  styled,
  type PopoverProps
} from '@mui/material'
import { useCallback, type FC } from 'react'

const Root = styled(Popover, {
  shouldForwardProp: prop =>
    prop !== 'placement' && prop !== 'inset' && prop !== 'disableClickAway'
})<{
  placement: 'top' | 'bottom'
  inset: number
  disableClickAway: boolean
}>(({ theme, placement, inset, disableClickAway }) => ({
  ...(!disableClickAway && {
    pointerEvents: 'none'
  }),
  [`& .${popoverClasses.paper}`]: {
    overflow: 'visible',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    pointerEvents: 'auto',
    ...(placement === 'top' && {
      paddingBottom: theme.spacing(inset)
    }),
    ...(placement === 'bottom' && {
      paddingTop: theme.spacing(inset)
    })
  }
}))

export interface OverlayPopoverProps extends PopoverProps {
  placement?: 'top' | 'bottom'
  inset?: number
  pinned?: boolean
  disableClickAway?: boolean
  children: JSX.Element
}

export const OverlayPopover: FC<OverlayPopoverProps> = ({
  placement = 'top',
  inset = 1,
  pinned = false,
  disableClickAway = false,
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
      if (disableClickAway || reason !== 'backdropClick') {
        onClose?.(event, reason)
      }
    },
    [disableClickAway, onClose]
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
      {...props}
      placement={placement}
      inset={inset}
      disableClickAway={disableClickAway}
    >
      {!disableClickAway ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>{children}</div>
        </ClickAwayListener>
      ) : (
        children
      )}
    </Root>
  )
}
