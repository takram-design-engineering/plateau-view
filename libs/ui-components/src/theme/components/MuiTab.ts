import { type Components, type Theme } from '@mui/material/styles'

export const MuiTab: Components<Theme>['MuiTab'] = {
  styleOverrides: {
    root: {
      textTransform: 'none'
    }
  }
}
