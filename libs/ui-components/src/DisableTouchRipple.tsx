import { css, GlobalStyles } from '@mui/material'
import { type FC } from 'react'

export const DisableTouchRipple: FC = () => (
  <GlobalStyles
    styles={css`
      .MuiTouchRipple-root {
        .MuiTouchRipple-ripple {
          animation: none !important;
          transform: scale(2) !important;
        }

        .MuiTouchRipple-rippleVisible {
          opacity: 0.05 !important;
        }

        .MuiTouchRipple-child {
          border-radius: 0 !important;
          animation: none !important;
        }
      }
    `}
  />
)
