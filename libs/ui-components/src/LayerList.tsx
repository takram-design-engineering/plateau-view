import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  type ListProps
} from '@mui/material'
import { forwardRef, type MouseEventHandler, type ReactNode } from 'react'

import { Scrollable } from './Scrollable'
import { ExpandArrowIcon } from './icons'

const Root = styled(List)({
  position: 'relative',
  padding: 0,
  maxHeight: 'calc(100% - 50px)'
}) as unknown as typeof List // For generics

const Footer = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body2,
  alignItems: 'center',
  height: theme.spacing(4),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50]
}))

const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(
  ({ theme }) => ({
    right: theme.spacing(1)
  })
)

const StyledScrollable = styled(Scrollable)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(4)} - 1px)`
}))

export interface LayerListProps extends ListProps<'div'> {
  footer?: ReactNode
  open?: boolean
  onOpen?: MouseEventHandler<HTMLButtonElement>
  onClose?: MouseEventHandler<HTMLButtonElement>
}

export const LayerList = forwardRef<HTMLDivElement, LayerListProps>(
  ({ footer, open = true, onOpen, onClose, children, ...props }, ref) => (
    <Root ref={ref} component='div' dense {...props}>
      {open && (
        <>
          <StyledScrollable>
            <List component='div' dense>
              {children}
            </List>
          </StyledScrollable>
          <Divider light />
        </>
      )}
      <Footer component='div'>
        <ListItemText>{footer ?? '\u00a0'}</ListItemText>
        <StyledListItemSecondaryAction>
          <IconButton
            size='small'
            aria-label={open ? '閉じる' : '開く'}
            onClick={open ? onClose : onOpen}
          >
            <ExpandArrowIcon expanded={open} />
          </IconButton>
        </StyledListItemSecondaryAction>
      </Footer>
    </Root>
  )
)
