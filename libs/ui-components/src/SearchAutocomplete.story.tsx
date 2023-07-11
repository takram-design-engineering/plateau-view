import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  List,
  ListItemSecondaryAction,
  ListSubheader
} from '@mui/material'
import { type Meta, type StoryObj } from '@storybook/react'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useState, type FC } from 'react'

import { AppOverlayLayout, AppOverlayLayoutContext } from './AppOverlayLayout'
import { EntityTitleButton } from './EntityTitleButton'
import { FloatingPanel } from './FloatingPanel'
import { BuildingIcon, DatasetIcon, LayerIcon, LocationIcon } from './icons'
import { LayerList } from './LayerList'
import { LayerListItem } from './LayerListItem'
import { SearchAutocomplete } from './SearchAutocomplete'

const meta: Meta<typeof SearchAutocomplete> = {
  title: 'SearchAutocomplete',
  component: SearchAutocomplete
}

export default meta

type Story = StoryObj<typeof SearchAutocomplete>

const options = [
  { type: 'dataset', name: 'Dataset 1' },
  { type: 'dataset', name: 'Dataset 2' },
  { type: 'dataset', name: 'Dataset 3' },
  { type: 'dataset', name: 'Dataset 4' },
  { type: 'building', name: 'Building 1' },
  { type: 'building', name: 'Building 2' },
  { type: 'building', name: 'Building 3' },
  { type: 'building', name: 'Building 4' },
  { type: 'address', name: 'Address 1' },
  { type: 'address', name: 'Address 2' },
  { type: 'address', name: 'Address 3' },
  { type: 'address', name: 'Address 4' }
] as const

const Component: FC = () => {
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleClickAway = useCallback(() => {
    setFocused(false)
  }, [])

  const { maxMainHeightAtom } = useContext(AppOverlayLayoutContext)
  const maxMainHeight = useAtomValue(maxMainHeightAtom)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <FloatingPanel>
        <SearchAutocomplete
          placeholder='データ、エリア、場所を検索'
          options={options}
          maxHeight={maxMainHeight}
          onFocus={handleFocus}
        >
          <Box>
            <Divider light />
            {!focused ? (
              <LayerList>
                <LayerListItem iconComponent={LayerIcon} title='Layer' />
                <LayerListItem iconComponent={LayerIcon} title='Layer' />
                <LayerListItem iconComponent={LayerIcon} title='Layer' />
                <LayerListItem iconComponent={LayerIcon} title='Layer' />
                <LayerListItem iconComponent={LayerIcon} title='Layer' />
              </LayerList>
            ) : (
              <List component='div' dense>
                <ListSubheader component='div'>
                  Layers
                  <ListItemSecondaryAction>
                    <Button variant='text' size='small'>
                      絞り込み
                    </Button>
                  </ListItemSecondaryAction>
                </ListSubheader>
                <EntityTitleButton
                  iconComponent={DatasetIcon}
                  title='Dataset'
                />
                <EntityTitleButton
                  iconComponent={DatasetIcon}
                  title='Dataset'
                />
                <EntityTitleButton
                  iconComponent={DatasetIcon}
                  title='Dataset'
                />
                <ListSubheader>
                  Buildings
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
                  Addresses
                  <ListItemSecondaryAction>
                    <Button variant='text' size='small'>
                      絞り込み
                    </Button>
                  </ListItemSecondaryAction>
                </ListSubheader>
                <EntityTitleButton
                  iconComponent={LocationIcon}
                  title='Address'
                />
                <EntityTitleButton
                  iconComponent={LocationIcon}
                  title='Address'
                />
                <EntityTitleButton
                  iconComponent={LocationIcon}
                  title='Address'
                />
              </List>
            )}
          </Box>
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}

export const Default: Story = {
  render: () => <AppOverlayLayout main={<Component />} />
}
