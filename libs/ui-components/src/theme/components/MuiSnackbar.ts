import { Fade } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiSnackbar: Components<Theme>['MuiSnackbar'] = {
  defaultProps: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center'
    },
    TransitionComponent: Fade
  }
}
