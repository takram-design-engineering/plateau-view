import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  alpha,
  listItemSecondaryActionClasses,
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
  // Half the opacity of the light style of divider.
  // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
  backgroundColor: alpha(theme.palette.divider, 0.04),
  [`& .${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(1)
  }
})) as unknown as typeof ListItem // For generics

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
      <Footer
        component='div'
        secondaryAction={
          <IconButton
            size='small'
            aria-label={open ? '閉じる' : '開く'}
            onClick={open ? onClose : onOpen}
          >
            <ExpandArrowIcon expanded={open} />
          </IconButton>
        }
      >
        <ListItemText>{footer ?? '\u00a0'}</ListItemText>
      </Footer>
    </Root>
  )
)
