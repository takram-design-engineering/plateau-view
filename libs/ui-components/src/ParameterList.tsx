import { List, ListSubheader, type ListProps } from '@mui/material'
import { forwardRef, type ReactNode } from 'react'

export interface ParameterListProps extends Omit<ListProps, 'title'> {
  title?: ReactNode
}

export const ParameterList = forwardRef<HTMLUListElement, ParameterListProps>(
  ({ title, children, ...props }, ref) => (
    <List ref={ref} dense disablePadding {...props}>
      {title != null && <ListSubheader disableGutters>{title}</ListSubheader>}
      {children}
    </List>
  )
)
