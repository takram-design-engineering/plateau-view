import { switchClasses } from '@mui/material'
import { type Components, type Theme } from '@mui/material/styles'

export const MuiSwitch: Components<Theme>['MuiSwitch'] = {
  defaultProps: {
    size: 'small'
  },
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const { margin, thumbSize, thumbMargin, trackWidth, trackPadding } =
        ownerState.size === 'small'
          ? {
              margin: -4,
              thumbSize: 14,
              thumbMargin: 8,
              trackWidth: 12,
              trackPadding: 1.5
            }
          : {
              margin: 0,
              thumbSize: 18,
              thumbMargin: 8,
              trackWidth: 14,
              trackPadding: 2
            }
      const light = theme.palette.mode === 'light'
      const color = light ? theme.palette.grey[400] : theme.palette.grey[800]
      return {
        width: thumbSize + trackWidth + (thumbMargin + trackPadding) * 2,
        height: thumbSize + (thumbMargin + trackPadding) * 2,
        margin,
        padding: 0,
        [`& .${switchClasses.switchBase}`]: {
          padding: trackPadding + thumbMargin,
          [`&.${switchClasses.checked}`]: {
            transform: `translateX(${trackWidth}px)`
          },
          [`&.${switchClasses.checked} .${switchClasses.thumb}`]: {
            color: theme.palette.grey[50]
          },
          [`&.${switchClasses.disabled} .${switchClasses.thumb}`]: {
            color,
            boxShadow: theme.shadows[0]
          },
          [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
            border: 0,
            opacity: 1
          },
          [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
            backgroundColor: color,
            opacity: 0.5
          }
        },
        [`& .${switchClasses.thumb}`]: {
          zIndex: 1, // Render above touch ripple
          width: thumbSize,
          height: thumbSize,
          color: theme.palette.grey[50],
          pointerEvents: 'none' // Pass events to input
        },
        [`& .${switchClasses.track}`]: {
          width: `calc(100% - ${thumbMargin * 2}px)`,
          height: `calc(100% - ${thumbMargin * 2}px)`,
          marginTop: thumbMargin,
          marginLeft: thumbMargin,
          borderRadius: thumbSize / 2 + trackPadding,
          backgroundColor: color,
          opacity: 1,
          transition: theme.transitions.create(['background-color', 'border'])
        }
      }
    }
  }
}
