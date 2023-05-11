import { sliderClasses } from '@mui/material'
import { alpha, type Components, type Theme } from '@mui/material/styles'

export const MuiSlider: Components<Theme>['MuiSlider'] = {
  styleOverrides: {
    track: {
      transition: 'none'
    },
    thumb: ({ theme, ownerState }) => ({
      transition: 'none',
      '&:hover': {
        boxShadow: `0px 0px 0px 8px ${alpha(
          theme.palette[ownerState.color ?? 'primary'].main,
          theme.palette.action.hoverOpacity
        )}`,
        // Reset on touch devices, it doesn't add specificity.
        '@media (hover: none)': {
          boxShadow: 'none'
        }
      },
      [`&.${sliderClasses.active}`]: {
        boxShadow: `0px 0px 0px 8px ${alpha(
          theme.palette[ownerState.color ?? 'primary'].main,
          0.3 // Touch ripple opacity
        )}`
      }
    })
  }
}
