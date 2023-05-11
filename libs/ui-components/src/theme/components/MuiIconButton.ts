import { type Components, type Theme } from '@mui/material/styles'

export const MuiIconButton: Components<Theme>['MuiIconButton'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(0.5)
    })
  }
}
