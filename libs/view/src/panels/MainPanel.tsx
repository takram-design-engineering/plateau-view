import { Divider, Stack, alpha, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useCallback, useRef, useState, type FC } from 'react'

import { LayerList, layerAtomsAtom } from '@takram/plateau-layers'
import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import {
  FloatingPanel,
  LayerList as LayerListComponent,
  SearchField,
  Shortcut
} from '@takram/plateau-ui-components'
import { ViewLayerListItem } from '@takram/plateau-view-layers'

import { MainMenuButton } from './MainPanel/MainMenuButton'

const Search = styled('div', {
  shouldForwardProp: prop => prop !== 'divider'
})<{
  divider: boolean
}>(({ theme, divider }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'row',
  minHeight: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
  zIndex: 1,
  ...(divider && {
    // Match the light style of divider.
    // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
    boxShadow: `0 1px 0 ${alpha(theme.palette.divider, 0.08)}`
  })
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
  const [layersOpen, setLayersOpen] = useState(true)
  const handleOpenLayers = useCallback(() => {
    setLayersOpen(true)
  }, [])
  const handleCloseLayers = useCallback(() => {
    setLayersOpen(false)
  }, [])

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
    <FloatingPanel scrollable>
      <div>
        <Search divider>
          <Stack direction='row' flexGrow={1} alignItems='center'>
            <MainMenuButton />
            <Divider orientation='vertical' light />
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
        <LayerList
          component={LayerListComponent}
          itemComponent={ViewLayerListItem}
          unmountWhenEmpty
          footer={`${layerAtoms.length}項目`}
          open={layersOpen}
          onOpen={handleOpenLayers}
          onClose={handleCloseLayers}
        />
      </div>
    </FloatingPanel>
  )
}
