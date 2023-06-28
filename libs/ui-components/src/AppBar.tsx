import {
  AppBar as MuiAppBar,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import { forwardRef } from 'react'

export interface AppBarProps extends MuiAppBarProps {}

export const AppBar = forwardRef<HTMLDivElement, AppBarProps>(
  ({ ...props }, ref) => <MuiAppBar ref={ref} {...props} />
)
