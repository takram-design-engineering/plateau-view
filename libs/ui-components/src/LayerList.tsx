import { List, type ListProps } from '@mui/material'
import { forwardRef } from 'react'

export interface LayerListProps extends ListProps<'div'> {}

export const LayerList = forwardRef<HTMLDivElement, LayerListProps>(
  (props, ref) => <List ref={ref} component='div' dense {...props} />
)
