import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { AppBar, Space } from '@takram/plateau-ui-components'

import { CameraButtons } from '../panels/CameraButtons'
import { DateControlButton } from '../panels/DateControlButton'
import { EnvironmentSelect } from '../panels/EnvironmentSelect'
import { LocationBreadcrumbs } from '../panels/LocationBreadcrumbs'
import { MainMenuButton } from '../panels/MainMenuButton'
import { SettingsButton } from '../panels/SettingsButton'
import { ToolButtons } from '../panels/ToolButtons'
import { hideAppOverlayAtom } from '../states/app'

export const AppHeader: FC = () => {
  const hidden = useAtomValue(hideAppOverlayAtom)
  if (hidden) {
    return null
  }
  return (
    <AppBar>
      <MainMenuButton />
      <Space size={2} />
      <ToolButtons />
      <Space />
      <SettingsButton />
      <DateControlButton />
      <EnvironmentSelect />
      <Space flexible />
      <LocationBreadcrumbs />
      <Space flexible />
      <CameraButtons />
    </AppBar>
  )
}
