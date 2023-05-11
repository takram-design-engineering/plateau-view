import { ThemeProvider } from '@mui/material'
import { type FC, type ReactNode } from 'react'

import { darkTheme } from './theme'

export interface DarkThemeOverrideProps {
  children?: ReactNode
}

export const DarkThemeOverride: FC<DarkThemeOverrideProps> = ({
  children,
  ...props
}) => (
  <ThemeProvider {...props} theme={darkTheme}>
    {children}
  </ThemeProvider>
)
