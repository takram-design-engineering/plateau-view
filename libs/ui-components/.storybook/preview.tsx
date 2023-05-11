import { ThemeProvider } from '@mui/material'
import { Preview } from '@storybook/react'
import React, { StrictMode } from 'react'

import { CssBaseline, darkTheme, lightTheme } from '../src'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: lightTheme.palette.background.default
        },
        {
          name: 'dark',
          value: darkTheme.palette.background.default
        }
      ]
    }
  },
  decorators: [
    Story => (
      <StrictMode>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </StrictMode>
    )
  ]
}

export default preview
