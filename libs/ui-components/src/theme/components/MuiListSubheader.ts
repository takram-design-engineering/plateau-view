import { listItemSecondaryActionClasses } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiListSubheader: Components<Theme>['MuiListSubheader'] = {
  defaultProps: {
    disableSticky: true
  },
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.typography.subtitle2,
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: theme.spacing(5),
      [`& .${listItemSecondaryActionClasses.root}`]: {
        right: theme.spacing(1)
      }
    })
  }
}
