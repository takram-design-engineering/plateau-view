import { Box, Divider, Stack, styled } from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useRef, useState, type FC } from 'react'

import {
  clearLayerSelectionAtom,
  layerAtomsAtom,
  LayerList
} from '@takram/plateau-layers'
import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import {
  FloatingPanel,
  LayerList as LayerListComponent,
  SearchField,
  Shortcut
} from '@takram/plateau-ui-components'
import { ViewLayerListItem } from '@takram/plateau-view-layers'

const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minHeight: theme.spacing(6),
  backgroundColor: theme.palette.background.default
}))

const StyledLayerList = styled(LayerListComponent)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(6)})`
}))

export const MainPanel: FC = () => {
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])
  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const layerAtoms = useAtomValue(layerAtomsAtom)
  const [layersOpen, setLayersOpen] = useState(false)
  const handleLayersOpen = useCallback(() => {
    setLayersOpen(true)
  }, [])
  const handleLayersClose = useCallback(() => {
    setLayersOpen(false)
  }, [])

  const clearLayerSelection = useSetAtom(clearLayerSelectionAtom)
  const handleLayersMouseDown = useCallback(() => {
    clearLayerSelection()
  }, [clearLayerSelection])

  const textFieldRef = useRef<HTMLInputElement>(null)

  useWindowEvent('keydown', event => {
    // TODO: Manage shortcut globally
    if (event.key === 'k' && event.metaKey && textFieldRef.current != null) {
      event.preventDefault()
      textFieldRef.current.select()
    }
  })

  const platform = useAtomValue(platformAtom)
  return (
    <FloatingPanel>
      <Search>
        <Stack direction='row' flexGrow={1} alignItems='center'>
          <SearchField
            inputRef={textFieldRef}
            variant='standard'
            fullWidth
            placeholder='データ、エリア、場所を検索'
            onFocus={handleFocus}
            onBlur={handleBlur}
            InputProps={{
              disableUnderline: true,
              ...(!focused && {
                endAdornment: (
                  <Shortcut
                    variant='outlined'
                    platform={platform}
                    shortcutKey='K'
                    commandKey
                  />
                )
              })
            }}
            sx={{ marginX: 1.5 }}
          />
        </Stack>
      </Search>
      <Box
        // TODO: Unmounting LayerList breaks layer states, and removed layers
        // stay visible.
        display={layerAtoms.length > 0 ? 'block' : 'none'}
      >
        <Divider light />
        <StyledLayerList
          footer={`${layerAtoms.length}項目`}
          open={layersOpen}
          onOpen={handleLayersOpen}
          onClose={handleLayersClose}
          onMouseDown={handleLayersMouseDown}
        >
          <LayerList itemComponent={ViewLayerListItem} unmountWhenEmpty />
        </StyledLayerList>
      </Box>
    </FloatingPanel>
  )
}
