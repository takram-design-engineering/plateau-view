import { Fade } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiPopover: Components<Theme>['MuiPopover'] = {
  defaultProps: {
    TransitionComponent: Fade,
    transitionDuration: 0
  }
}
