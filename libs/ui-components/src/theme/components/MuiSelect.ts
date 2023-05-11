import { filledInputClasses } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

import { UnfoldIcon } from '../../icons/UnfoldIcon'

export const MuiSelect: Components<Theme>['MuiSelect'] = {
  defaultProps: {
    size: 'small',
    IconComponent: UnfoldIcon
  },
  styleOverrides: {
    select: ({ theme, ownerState }) => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      [`&.${filledInputClasses.input}`]: {
        ...((ownerState.size ?? 'small') === 'small' && {
          paddingRight: theme.spacing(3)
        })
      }
    }),
    icon: ({ theme, ownerState }) => ({
      color: theme.palette.text.secondary,
      ...((ownerState.size ?? 'small') === 'small' && {
        right: 0
      })
    })
  }
}
