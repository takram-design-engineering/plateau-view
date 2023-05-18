import { type Components, type Theme } from '@mui/material/styles'

export const MuiSvgIcon: Components<Theme>['MuiSvgIcon'] = {
  styleOverrides: {
    fontSizeSmall: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(16)
    }),
    fontSizeMedium: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(24)
    }),
    fontSizeLarge: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(32)
    })
  }
}
