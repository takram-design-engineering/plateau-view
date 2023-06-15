import { outlinedInputClasses } from '@mui/material'
import { alpha, type Components, type Theme } from '@mui/material'

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => {
      const borderColor =
        theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, 0.23)'
          : 'rgba(255, 255, 255, 0.23)'
      return {
        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
          backgroundColor: alpha(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity
          ),
          borderColor
        },
        [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
          {
            backgroundColor: alpha(
              theme.palette.text.primary,
              theme.palette.action.hoverOpacity
            ),
            borderColor,
            borderWidth: 1
          }
      }
    },
    notchedOutline: ({ theme }) => {
      return {
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.short
        })
      }
    }
  }
}
