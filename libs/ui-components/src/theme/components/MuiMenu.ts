import { Fade } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiMenu: Components<Theme>['MuiMenu'] = {
  defaultProps: {
    marginThreshold: 8,
    TransitionComponent: Fade,
    transitionDuration: 0
  }
}
