import {
  List,
  ListItem,
  ListItemSecondaryAction,
  Stack,
  Typography,
  styled
} from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, type FC } from 'react'

import { useWindowEvent } from '@takram/plateau-react-helpers'
import { Shortcut } from '@takram/plateau-ui-components'

import { platformAtom, showDeveloperPanelsAtom } from '../states/app'
import { AppPanel } from './AppPanel'
import { GraphicsPanel } from './GraphicsPanel'
import { PerformancePanel } from './PerformancePanel'

const Root = styled('div')(({ theme }) => ({
  width: 320,
  padding: theme.spacing(1),
  paddingTop: 0
}))

const Header = styled(List)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  margin: `0 ${theme.spacing(-1)}`,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  zIndex: 1
}))

export const DeveloperPanels: FC = () => {
  // TODO: Just a temporary key binding
  const [showDeveloperPanels, setShowDeveloperPanels] = useAtom(
    showDeveloperPanelsAtom
  )
  useWindowEvent('keydown', event => {
    if (event.code === 'Backslash' && event.metaKey) {
      event.preventDefault()
      setShowDeveloperPanels(value => !value)
    }
  })

  const handleClose = useCallback(() => {
    setShowDeveloperPanels(false)
  }, [setShowDeveloperPanels])

  const platform = useAtomValue(platformAtom)

  if (!showDeveloperPanels) {
    return null
  }
  return (
    <Root>
      <Header>
        <ListItem disablePadding disableGutters>
          <Typography variant='subtitle1' color='text.primary'>
            Developer Panels
          </Typography>
          <ListItemSecondaryAction>
            <Shortcut
              variant='outlined'
              platform={platform}
              shortcutKey='\'
              commandKey
              onClick={handleClose}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </Header>
      <Stack spacing={1} marginTop={1}>
        <AppPanel />
        <PerformancePanel />
        <GraphicsPanel />
      </Stack>
    </Root>
  )
}
