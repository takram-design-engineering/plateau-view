import { useMediaQuery, useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { AppBar, Space } from '@takram/plateau-ui-components'

import { hideAppOverlayAtom } from '../states/app'
import { CameraButtons } from './CameraButtons'
import { DateControlButton } from './DateControlButton'
import { EnvironmentSelect } from './EnvironmentSelect'
import { GeolocationButton } from './GeolocationButton'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'
import { MainMenuButton } from './MainMenuButton'
import { SettingsButton } from './SettingsButton'
import { ToolButtons } from './ToolButtons'

export const AppHeader: FC = () => {
  const hidden = useAtomValue(hideAppOverlayAtom)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  if (hidden) {
    return null
  }
  return (
    <AppBar>
      <MainMenuButton />
      {smUp && (
        <>
          <Space size={2} />
          <ToolButtons />
        </>
      )}
      <Space flexible={!smUp} />
      <SettingsButton />
      <DateControlButton />
      <EnvironmentSelect />
      {smUp && (
        <>
          <Space flexible />
          <LocationBreadcrumbs />
          <Space flexible />
        </>
      )}
      <GeolocationButton />
      {smUp && <CameraButtons />}
    </AppBar>
  )
}
