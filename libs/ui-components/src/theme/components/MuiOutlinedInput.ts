import {
  alpha,
  outlinedInputClasses,
  type Components,
  type Theme
} from '@mui/material'

export const MuiOutlinedInput: Components<Theme>['MuiOutlinedInput'] = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.palette.divider
        },
        [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
          backgroundColor: alpha(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity
          ),
          borderColor: theme.palette.divider
        },
        [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
          {
            backgroundColor: alpha(
              theme.palette.text.primary,
              theme.palette.action.hoverOpacity
            ),
            borderColor: theme.palette.divider,
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
