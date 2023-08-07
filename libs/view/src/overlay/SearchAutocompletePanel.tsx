import { ClickAwayListener, Divider, styled } from '@mui/material'
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
  AppOverlayLayoutContext,
  FloatingPanel,
  Scrollable,
  SearchAutocomplete,
  Shortcut,
  testShortcut,
  type SearchAutocompleteProps,
  type SearchOption
} from '@takram/plateau-ui-components'

import { useSearchOptions } from '../hooks/useSearchOptions'
import { SearchList } from './SearchList'

const StyledScrollable = styled(Scrollable)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(6)} - 1px)`
}))

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
  const handleOptionSelect = useCallback(
    (event: MouseEvent, option: SearchOption) => {
      selectOption(option)
    },
    [selectOption]
  )

  const [filters, setFilters] = useState<string[]>()
  const handleFiltersChange = useCallback(
    (event: MouseEvent, filters: string[]) => {
      setFilters(filters)
    },
    []
  )

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
              <SearchList
                datasets={searchOptions.datasets}
                buildings={searchOptions.buildings}
                addresses={searchOptions.addresses}
                onOptionSelect={handleOptionSelect}
                onFiltersChange={handleFiltersChange}
              />
            </StyledScrollable>
          )}
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}
