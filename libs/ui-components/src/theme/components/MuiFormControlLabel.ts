import { type Components, type Theme } from '@mui/material/styles'

export const MuiFormControlLabel: Components<Theme>['MuiFormControlLabel'] = {
  styleOverrides: {
    root: {
      margin: 0
    },
    label: ({ theme }) => ({
      marginLeft: theme.spacing(1)
    })
  }
}
