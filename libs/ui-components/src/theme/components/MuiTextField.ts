import {
  filledInputClasses,
  inputAdornmentClasses,
  inputBaseClasses,
  inputClasses
} from '@mui/material'
import { alpha, type Components, type Theme } from '@mui/material/styles'

export const MuiTextField: Components<Theme>['MuiTextField'] = {
  defaultProps: {
    variant: 'filled',
    InputLabelProps: {
      shrink: true
    }
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const light = theme.palette.mode === 'light'
      const color = light ? '#000000' : '#ffffff'
      const paddingX = theme.shape.borderRadius
      const paddingY = ownerState.size === 'small' ? 7 : 10.5
      return {
        ...(ownerState.size === 'small' && theme.typography.body2),
        [`& .${filledInputClasses.root}`]: {
          backgroundColor: alpha(color, 0.06),
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            backgroundColor: alpha(color, 0.13)
          },
          [`&.${inputClasses.focused}`]: {
            backgroundColor: alpha(color, 0.06)
          },
          [`&.${inputClasses.disabled}`]: {
            backgroundColor: alpha(color, 0.13)
          },
          [`& .${inputBaseClasses.input}`]: {
            paddingTop: paddingY,
            paddingRight: paddingX,
            paddingBottom: paddingY,
            paddingLeft: paddingX
          },
          [`& .${inputAdornmentClasses.root}` +
          `.${inputAdornmentClasses.positionStart}` +
          `:not(.${inputAdornmentClasses.hiddenLabel})`]: {
            marginTop: 0
          }
        },
        // Input padding
        [`& .${inputBaseClasses.input}`]: {
          [`&.${inputBaseClasses.inputAdornedStart}`]: {
            paddingLeft: 0
          },
          [`&.${inputBaseClasses.inputAdornedEnd}`]: {
            paddingRight: 0
          }
        }
      }
    }
  }
}
