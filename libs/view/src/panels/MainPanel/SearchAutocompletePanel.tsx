import {
  Button,
  ClickAwayListener,
  Divider,
  ListItemSecondaryAction,
  ListSubheader,
  MenuList,
  styled
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
  Scrollable,
  SearchAutocomplete,
  Shortcut,
  testShortcut,
  type EntityTitleButtonProps,
  type SearchAutocompleteProps,
  type SearchOption
} from '@takram/plateau-ui-components'

import { useSearchOptions } from './useSearchOptions'

const StyledScrollable = styled(Scrollable)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(6)} - 1px)`
}))

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

const FilterButton: FC<{
  filter: string
  onClick?: (event: MouseEvent, filter: string) => void
}> = ({ filter, onClick }) => {
  const handleClick = useCallback(
    (event: MouseEvent) => {
      onClick?.(event, filter)
    },
    [filter, onClick]
  )
  return (
    <Button variant='text' size='small' onClick={handleClick}>
      絞り込み
    </Button>
  )
}

export interface SearchAutocompletePanelProps {
  children?: ReactNode
}

export const SearchAutocompletePanel: FC<SearchAutocompletePanelProps> = ({
  children
}) => {
  const textFieldRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const searchOptions = useSearchOptions({
    skip: !focused
  })
  const options = useMemo(
    () => [
      ...searchOptions.datasets,
      ...searchOptions.buildings,
      ...searchOptions.addresses
    ],
    [searchOptions.datasets, searchOptions.buildings, searchOptions.addresses]
  )
  const selectOption = searchOptions.select

  const [filters, setFilters] = useState<string[]>()
  const handleClickFilter = useCallback((event: MouseEvent, filter: string) => {
    setFilters([filter])
  }, [])

  const handleChange: NonNullable<SearchAutocompleteProps['onChange']> =
    useCallback(
      (event, values, reason, details) => {
        if (reason === 'removeOption') {
          setFilters([])
          return
        }
        const [value] = values.filter(
          (value: SearchOption | string): value is SearchOption =>
            typeof value !== 'string' && value.type !== 'filter'
        )
        if (value == null) {
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
    if (
      testShortcut(event, platform, {
        code: 'KeyK',
        commandKey: true
      })
    ) {
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
          filters={filters}
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
          <Divider />
          {!focused ? (
            children
          ) : (
            <StyledScrollable>
              <MenuList component='div' dense>
                {searchOptions.datasets.length > 0 && [
                  <ListSubheader component='div' key='datasets'>
                    周辺のデータセット
                    <ListItemSecondaryAction>
                      <FilterButton
                        filter='dataset'
                        onClick={handleClickFilter}
                      />
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
                      <FilterButton
                        filter='building'
                        onClick={handleClickFilter}
                      />
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
                      <FilterButton
                        filter='address'
                        onClick={handleClickFilter}
                      />
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
            </StyledScrollable>
          )}
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}
