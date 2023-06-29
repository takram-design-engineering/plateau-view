import { type Components, type Theme } from '@mui/material/styles'

export const MuiPaper: Components<Theme>['MuiPaper'] = {
  styleOverrides: {
    root: {
      backgroundImage: 'none'
    }
  }
}
