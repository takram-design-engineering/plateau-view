import {
  Button,
  ClickAwayListener,
  Divider,
  List,
  ListItemSecondaryAction,
  ListSubheader,
  styled
} from '@mui/material'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useRef, useState, type FC } from 'react'

import {
  clearLayerSelectionAtom,
  layerAtomsAtom,
  LayerList
} from '@takram/plateau-layers'
import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import {
  AppOverlayLayoutContext,
  BuildingIcon,
  DatasetIcon,
  EntityTitleButton,
  FloatingPanel,
  LayerList as LayerListComponent,
  LocationIcon,
  SearchAutocomplete,
  Shortcut
} from '@takram/plateau-ui-components'
import { ViewLayerListItem } from '@takram/plateau-view-layers'

import { useSearchOptions } from '../hooks/useSearchOptions'

const StyledLayerList = styled(LayerListComponent)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(6)})`
}))

const options = [
  ...[...Array(100)].map((_, index) => ({
    type: 'dataset' as const,
    name: `Dataset ${index}`
  })),
  ...[...Array(100)].map((_, index) => ({
    type: 'building' as const,
    name: `Building ${index}`
  })),
  ...[...Array(100)].map((_, index) => ({
    type: 'address' as const,
    name: `Address ${index}`
  }))
]

export const MainPanel: FC = () => {
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

  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleClickAway = useCallback(() => {
    setFocused(false)
  }, [])

  useWindowEvent('keydown', event => {
    // TODO: Manage shortcut globally
    if (event.key === 'k' && event.metaKey && textFieldRef.current != null) {
      event.preventDefault()
      if (document.activeElement !== textFieldRef.current) {
        textFieldRef.current.select()
      } else {
        textFieldRef.current.blur()
        setFocused(false)
      }
    }
  })

  const areaOptions = useSearchOptions()

  const { maxMainHeightAtom } = useContext(AppOverlayLayoutContext)
  const maxMainHeight = useAtomValue(maxMainHeightAtom)

  const platform = useAtomValue(platformAtom)
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <FloatingPanel>
        <SearchAutocomplete
          inputRef={textFieldRef}
          placeholder='データセット、建築物、住所を検索'
          options={options}
          maxHeight={maxMainHeight}
          onFocus={handleFocus}
          endAdornment={
            <Shortcut
              variant='outlined'
              platform={platform}
              shortcutKey='K'
              commandKey
            />
          }
        >
          <Divider light />
          {!focused ? (
            <StyledLayerList
              footer={`${layerAtoms.length}項目`}
              open={layersOpen}
              onOpen={handleLayersOpen}
              onClose={handleLayersClose}
              onMouseDown={handleLayersMouseDown}
            >
              <LayerList itemComponent={ViewLayerListItem} unmountWhenEmpty />
            </StyledLayerList>
          ) : (
            <List component='div' dense>
              {areaOptions.length > 0 && (
                <>
                  <ListSubheader component='div'>
                    このエリアのデータセット
                    <ListItemSecondaryAction>
                      <Button variant='text' size='small'>
                        絞り込み
                      </Button>
                    </ListItemSecondaryAction>
                  </ListSubheader>
                  {areaOptions.slice(0, 5).map(({ name }) => (
                    <EntityTitleButton
                      key={name}
                      iconComponent={DatasetIcon}
                      title={name}
                    />
                  ))}
                </>
              )}
              <ListSubheader>
                このエリアの建築物
                <ListItemSecondaryAction>
                  <Button variant='text' size='small'>
                    絞り込み
                  </Button>
                </ListItemSecondaryAction>
              </ListSubheader>
              <EntityTitleButton
                iconComponent={BuildingIcon}
                title='Building'
              />
              <EntityTitleButton
                iconComponent={BuildingIcon}
                title='Building'
              />
              <EntityTitleButton
                iconComponent={BuildingIcon}
                title='Building'
              />
              <ListSubheader>
                このエリアの住所
                <ListItemSecondaryAction>
                  <Button variant='text' size='small'>
                    絞り込み
                  </Button>
                </ListItemSecondaryAction>
              </ListSubheader>
              <EntityTitleButton iconComponent={LocationIcon} title='Address' />
              <EntityTitleButton iconComponent={LocationIcon} title='Address' />
              <EntityTitleButton iconComponent={LocationIcon} title='Address' />
            </List>
          )}
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}
