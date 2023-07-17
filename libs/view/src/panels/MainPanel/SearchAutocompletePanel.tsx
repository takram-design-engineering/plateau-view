import {
  Button,
  ClickAwayListener,
  Divider,
  ListItemSecondaryAction,
  ListSubheader,
  MenuList
} from '@mui/material'
import { useAtomValue } from 'jotai'
import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FC,
  type MouseEvent,
  type ReactNode
} from 'react'

import { useWindowEvent } from '@takram/plateau-react-helpers'
import { platformAtom } from '@takram/plateau-shared-states'
import {
  AddressIcon,
  AppOverlayLayoutContext,
  BuildingIcon,
  DatasetIcon,
  EntityTitleButton,
  FloatingPanel,
  SearchAutocomplete,
  Shortcut,
  type EntityTitleButtonProps,
  type SearchAutocompleteProps,
  type SearchOption
} from '@takram/plateau-ui-components'

import { useSearchOptions } from './useSearchOptions'

const OptionItem: FC<{
  iconComponent: EntityTitleButtonProps['iconComponent']
  option: SearchOption
  onClick?: (event: MouseEvent, option: SearchOption) => void
}> = ({ iconComponent, option, onClick }) => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      onClick?.(event, option)
    },
    [option, onClick]
  )
  return (
    <EntityTitleButton
      iconComponent={iconComponent}
      title={option.name}
      onClick={handleClick}
    />
  )
}

export interface SearchAutocompletePanelProps {
  children?: ReactNode
}

export const SearchAutocompletePanel: FC<SearchAutocompletePanelProps> = ({
  children
}) => {
  const searchOptions = useSearchOptions()
  const options = useMemo(
    () => [
      ...searchOptions.datasets,
      ...searchOptions.buildings,
      ...searchOptions.addresses
    ],
    [searchOptions.datasets, searchOptions.buildings, searchOptions.addresses]
  )
  const selectOption = searchOptions.select

  const textFieldRef = useRef<HTMLInputElement>(null)

  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleChange: NonNullable<SearchAutocompleteProps['onChange']> =
    useCallback(
      (event, values, reason, details) => {
        if (values.length !== 1) {
          return
        }
        const [value] = values
        if (typeof value === 'string') {
          return
        }
        selectOption(value)
        textFieldRef.current?.blur()
        setFocused(false)
      },
      [selectOption]
    )

  const handleClickOption = useCallback(
    (event: MouseEvent, option: SearchOption) => {
      selectOption(option)
    },
    [selectOption]
  )

  useWindowEvent('keydown', event => {
    // TODO: Manage shortcut globally
    if (textFieldRef.current == null) {
      return
    }
    if (event.key === 'k' && event.metaKey) {
      event.preventDefault()
      if (document.activeElement !== textFieldRef.current) {
        textFieldRef.current.select()
      } else {
        textFieldRef.current.blur()
        setFocused(false)
      }
    }
  })

  const handleClickAway = useCallback(() => {
    setFocused(false)
  }, [])

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
          onChange={handleChange}
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
            children
          ) : (
            <MenuList component='div' dense>
              {searchOptions.datasets.length > 0 && [
                <ListSubheader component='div' key='datasets'>
                  周辺のデータセット
                  <ListItemSecondaryAction>
                    <Button variant='text' size='small'>
                      絞り込み
                    </Button>
                  </ListItemSecondaryAction>
                </ListSubheader>,
                ...searchOptions.datasets
                  .slice(0, 4)
                  .map((option, index) => (
                    <OptionItem
                      key={`datasets:${index}`}
                      iconComponent={DatasetIcon}
                      option={option}
                      onClick={handleClickOption}
                    />
                  ))
              ]}
              {searchOptions.buildings.length > 0 && [
                <ListSubheader key='buildings'>
                  周辺の建築物
                  <ListItemSecondaryAction>
                    <Button variant='text' size='small'>
                      絞り込み
                    </Button>
                  </ListItemSecondaryAction>
                </ListSubheader>,
                ...searchOptions.buildings
                  .slice(0, 4)
                  .map((option, index) => (
                    <OptionItem
                      key={`buildings:${index}`}
                      iconComponent={BuildingIcon}
                      option={option}
                      onClick={handleClickOption}
                    />
                  ))
              ]}
              {searchOptions.addresses.length > 0 && [
                <ListSubheader key='addresses'>
                  周辺の住所
                  <ListItemSecondaryAction>
                    <Button variant='text' size='small'>
                      絞り込み
                    </Button>
                  </ListItemSecondaryAction>
                </ListSubheader>,
                ...searchOptions.addresses
                  .slice(0, 4)
                  .map((option, index) => (
                    <OptionItem
                      key={`addresses:${index}`}
                      iconComponent={AddressIcon}
                      option={option}
                      onClick={handleClickOption}
                    />
                  ))
              ]}
            </MenuList>
          )}
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}
