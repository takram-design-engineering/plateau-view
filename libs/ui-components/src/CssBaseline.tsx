import {
  GlobalStyles,
  CssBaseline as MuiCssBaseline,
  css,
  useTheme
} from '@mui/material'
import { type FC } from 'react'

import { DisableTouchRipple } from './DisableTouchRipple'

export const CssBaseline: FC = () => {
  const theme = useTheme()
  return (
    <>
      <MuiCssBaseline />
      <GlobalStyles
        styles={css`
          body {
            font-family: ${theme.typography.fontFamily};
            letter-spacing: 0.015em;
          }

          * {
            letter-spacing: inherit;
          }
        `}
      />
      <DisableTouchRipple />
    </>
  )
}