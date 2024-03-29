import { List, ListItem, Stack, styled, Typography } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, type FC } from 'react'

import { platformAtom } from '@takram/plateau-shared-states'
import { Shortcut } from '@takram/plateau-ui-components'

import { showDeveloperPanelsAtom } from '../states/app'
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
  const platform = useAtomValue(platformAtom)
  const [showDeveloperPanels, setShowDeveloperPanels] = useAtom(
    showDeveloperPanelsAtom
  )

  const handleClose = useCallback(() => {
    setShowDeveloperPanels(false)
  }, [setShowDeveloperPanels])

  if (!showDeveloperPanels) {
    return null
  }
  return (
    <Root>
      <Header>
        <ListItem
          disablePadding
          disableGutters
          secondaryAction={
            <Shortcut
              variant='outlined'
              platform={platform}
              shortcutKey='\'
              commandKey
              onClick={handleClose}
            />
          }
        >
          <Typography variant='subtitle1' color='text.primary'>
            Developer Panels
          </Typography>
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
