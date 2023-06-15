import { type Components, type Theme } from '@mui/material/styles'

export const MuiToggleButton: Components<Theme>['MuiToggleButton'] = {
  styleOverrides: {
    root: {
      textTransform: 'none'
    },
    sizeSmall: ({ theme }) => ({
      ...theme.typography.body2,
      padding: theme.spacing(1)
    })
  }
}
