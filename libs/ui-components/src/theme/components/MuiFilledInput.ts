import { filledInputClasses } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiFilledInput: Components<Theme>['MuiFilledInput'] = {
  defaultProps: {
    hiddenLabel: true,
    disableUnderline: true
  },
  styleOverrides: {
    root: ({ theme }) => {
      const light = theme.palette.mode === 'light'
      // https://github.com/mui/material-ui/blob/master/packages/mui-material/src/FilledInput/FilledInput.js#L44
      const backgroundColor = light
        ? 'rgba(0, 0, 0, 0.06)'
        : 'rgba(255, 255, 255, 0.09)'
      return {
        overflow: 'hidden',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor // Prevent visual glitch
        },
        // Focus is already visible. Duplicate.
        [`& .${filledInputClasses.input}:focus`]: {
          backgroundColor: 'transparent'
        }
      }
    },
    input: ({ theme, ownerState }) => ({
      ...(ownerState.size === 'small' && {
        paddingTop: 6,
        paddingRight: theme.spacing(1),
        paddingBottom: 6,
        paddingLeft: theme.spacing(1)
      })
    })
  }
}
