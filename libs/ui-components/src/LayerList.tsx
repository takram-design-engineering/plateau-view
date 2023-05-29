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

import { ExpandArrowIcon } from './icons'

const Root = styled(List)({
  padding: 0
}) as unknown as typeof List // For generics

const Content = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
})) as unknown as typeof List // For generics

const Footer = styled(ListItem)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[50]
}))

const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(
  ({ theme }) => ({
    right: theme.spacing(1)
  })
)

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
          <Content component='div' dense>
            {children}
          </Content>
          <Divider light />
        </>
      )}
      <Footer>
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
