import { svgIconClasses } from '@mui/material'
import {
  darken,
  lighten,
  type Components,
  type Theme
} from '@mui/material/styles'

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    variant: 'contained',
    color: 'inherit',
    disableElevation: true
  },
  styleOverrides: {
    root: {
      textTransform: 'none',
      whiteSpace: 'nowrap'
    },
    sizeSmall: ({ theme }) => ({
      ...theme.typography.body2
    }),
    textPrimary: ({ theme }) => ({
      color:
        theme.palette.mode === 'light'
          ? darken(theme.palette.primary.main, 0.1)
          : lighten(theme.palette.primary.main, 0.1)
    }),
    startIcon: {
      [`& .${svgIconClasses.root}`]: {
        fontSize: 16
      }
    },
    endIcon: {
      [`& .${svgIconClasses.root}`]: {
        fontSize: 16
      }
    }
  }
}
