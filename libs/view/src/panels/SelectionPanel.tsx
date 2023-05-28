import { Stack, Typography, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { FloatingPanel } from '@takram/plateau-ui-components'

const Root = styled(FloatingPanel)({
  width: 360
})

export const SelectionPanel: FC = () => {
  const selection = useAtomValue(screenSpaceSelectionAtom)
  if (selection.length === 0) {
    return null
  }
  return (
    <Root scrollable>
      <Stack spacing={1} margin={2}>
        <Typography variant='subtitle2'>
          Selection Count: {selection.length}
        </Typography>
      </Stack>
    </Root>
  )
}
