import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { AppBar, Space } from '@takram/plateau-ui-components'

import { hideAppOverlayAtom } from '../states/app'
import { CameraButtons } from './CameraButtons'
import { DateControlButton } from './DateControlButton'
import { EnvironmentSelect } from './EnvironmentSelect'
import { LocationBreadcrumbs } from './LocationBreadcrumbs'
import { MainMenuButton } from './MainMenuButton'
import { SettingsButton } from './SettingsButton'
import { ToolButtons } from './ToolButtons'

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
