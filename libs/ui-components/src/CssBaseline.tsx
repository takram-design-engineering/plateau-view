import {
  css,
  GlobalStyles,
  CssBaseline as MuiCssBaseline,
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
          html {
            // "lang=ja" automatically sets this but it makes fonts little
            // bigger in Chrome. I don't know whether it's Chrome's behavior or
            // some libraries are injecting styles.
            -webkit-locale: auto;
          }

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
