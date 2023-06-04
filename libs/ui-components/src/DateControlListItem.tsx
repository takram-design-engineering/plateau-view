import {
  ListItemButton,
  ListItemText,
  styled,
  type ListItemButtonProps
} from '@mui/material'
import { forwardRef, type ReactNode } from 'react'

const Root = styled(ListItemButton)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  // Margin and padding can be border radius, but I prefer them to be aligned
  // with the base spacing.
  marginRight: theme.spacing(-1),
  marginLeft: theme.spacing(-1),
  paddingRight: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  borderRadius: theme.shape.borderRadius
}))

const Label = styled(ListItemText)({
  flexGrow: 0
})

const Value = styled(ListItemText)(({ theme }) => ({
  flexGrow: 0,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums'
}))

export interface DateControlListItemProps
  extends Omit<ListItemButtonProps, 'children'> {
  label: ReactNode
  value?: ReactNode
}

export const DateControlListItem = forwardRef<
  HTMLDivElement,
  DateControlListItemProps
>(({ label, value, ...props }, ref) => (
  <Root ref={ref} disableGutters {...props}>
    <Label>{label}</Label>
    <Value>{value}</Value>
  </Root>
))
