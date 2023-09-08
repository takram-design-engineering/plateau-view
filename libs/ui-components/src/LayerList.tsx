import {
  alpha,
  Divider,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  listItemSecondaryActionClasses,
  ListItemText,
  styled,
  type ListItem,
  type ListProps
} from '@mui/material'
import {
  forwardRef,
  type ForwardedRef,
  type MouseEventHandler,
  type ReactNode
} from 'react'

import { ExpandArrowIcon } from './icons'
import { Scrollable } from './Scrollable'

const Root = styled(List)({
  position: 'relative',
  padding: 0,
  height: '100%',
  maxHeight: 'calc(100% - 50px)'
}) as unknown as typeof List // For generics

const Footer = styled(ListItemButton)(({ theme }) => ({
  ...theme.typography.body2,
  alignItems: 'center',
  height: theme.spacing(4),
  color: theme.palette.text.secondary,
  // Half the opacity of the light style of divider.
  // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
  backgroundColor: alpha(theme.palette.divider, 0.04),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(1),
    svg: {
      display: 'block'
    }
  }
})) as unknown as typeof ListItem // For generics

const StyledScrollable = styled(Scrollable)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(4)})`
}))

export interface LayerListProps extends ListProps<'div'> {
  listRef?: ForwardedRef<HTMLDivElement>
  footer?: ReactNode
  open?: boolean
  onOpen?: MouseEventHandler<HTMLLIElement>
  onClose?: MouseEventHandler<HTMLLIElement>
}

export const LayerList = forwardRef<HTMLDivElement, LayerListProps>(
  (
    { listRef, footer, open = true, onOpen, onClose, children, ...props },
    ref
  ) => (
    <Root ref={ref} component='div' dense {...props}>
      {open && (
        <>
          <StyledScrollable>
            <List ref={listRef} component='div' dense>
              {children}
            </List>
          </StyledScrollable>
          <Divider />
        </>
      )}
      <Footer
        aria-label={open ? '閉じる' : '開く'}
        onClick={open ? onClose : onOpen}
      >
        <ListItemText>{footer ?? '\u00a0'}</ListItemText>
        <ListItemSecondaryAction>
          <ExpandArrowIcon expanded={open} />
        </ListItemSecondaryAction>
      </Footer>
    </Root>
  )
)
