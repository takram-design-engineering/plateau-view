import { Fade } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiTooltip: Components<Theme>['MuiTooltip'] = {
  defaultProps: {
    arrow: true,
    enterDelay: 500,
    TransitionComponent: Fade,
    TransitionProps: {
      timeout: 0
    }
  },
  styleOverrides: {
    tooltip: ({ theme }) => ({
      padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`,
      backgroundColor: theme.palette.grey[900],
      borderRadius: theme.shape.borderRadius / 2
    }),
    arrow: ({ theme }) => ({
      color: theme.palette.grey[900]
    })
  }
}
