import { listItemIconClasses, menuItemClasses } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiMenuItem: Components<Theme>['MuiMenuItem'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${menuItemClasses.selected}`]: {
        backgroundColor: 'transparent',
        [`&.${menuItemClasses.focusVisible}`]: {
          backgroundColor: theme.palette.action.focus
        }
      },
      [`&.${menuItemClasses.selected}:hover`]: {
        backgroundColor: theme.palette.action.hover
      },
      [`& .${listItemIconClasses.root}`]: {
        minWidth: 'auto',
        marginRight: theme.spacing(1),
        color: theme.palette.text.primary
      }
    })
  }
}
