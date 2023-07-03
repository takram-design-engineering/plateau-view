import {
  iconButtonClasses,
  AppBar as MuiAppBar,
  styled,
  Toolbar,
  toolbarClasses,
  type AppBarProps as MuiAppBarProps
} from '@mui/material'
import { forwardRef } from 'react'

import { DarkThemeOverride } from './DarkThemeOverride'

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default
}))

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  [`&.${toolbarClasses.root}`]: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    minHeight: theme.spacing(6)
  },
  [`& .${iconButtonClasses.root}`]: {
    minHeight: theme.spacing(5),
    minWidth: theme.spacing(6)
  }
}))

export interface AppBarProps extends MuiAppBarProps {}

export const AppBar = forwardRef<HTMLDivElement, AppBarProps>(
  ({ children, ...props }, ref) => (
    <DarkThemeOverride>
      <StyledAppBar ref={ref} position='static' elevation={0} {...props}>
        <StyledToolbar>{children}</StyledToolbar>
      </StyledAppBar>
    </DarkThemeOverride>
  )
)
