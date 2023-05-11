import { Stack, Typography, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useContext, type FC } from 'react'

import { ScreenSpaceSelectionContext } from '@plateau/screen-space-selection'
import { FloatingPanel } from '@plateau/ui-components'

const Root = styled(FloatingPanel)({
  width: 360
})

export const SelectionPanel: FC = () => {
  const { selectionAtom } = useContext(ScreenSpaceSelectionContext)
  const selection = useAtomValue(selectionAtom)
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
