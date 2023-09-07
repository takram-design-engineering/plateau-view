import {
  ClickAwayListener,
  Divider,
  styled,
  Tab,
  tabClasses,
  Tabs,
  type FilterOptionsState
} from '@mui/material'
import { useAtomValue } from 'jotai'
import {
  useCallback,
  useContext,
  useDeferredValue,
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
import { DatasetAreaList } from './DatasetAreaList'
import { DatasetTypeList } from './DatasetTypeList'
import { SearchList } from './SearchList'

const StyledScrollable = styled(Scrollable)(({ theme }) => ({
  maxHeight: `calc(100% - ${theme.spacing(6)} - 1px)`
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  minHeight: theme.spacing(5),
  backgroundColor: theme.palette.background.default,
  zIndex: 1,
  [`& .${tabClasses.root}`]: {
    minHeight: theme.spacing(5)
  }
}))

function filterOptions(
  options: SearchOption[],
  state: FilterOptionsState<SearchOption>
): SearchOption[] {
  const tokens = state.inputValue.split(/\s+/).filter(value => value.length > 0)
  return tokens.length > 0
    ? options.filter(option => {
        return tokens.some(token =>
          state.getOptionLabel(option).includes(token)
        )
      })
    : options
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

  const [inputValue, setInputValue] = useState('')
  const handleInputChange: NonNullable<
    SearchAutocompleteProps['onInputChange']
  > = useCallback((event, value, reason) => {
    setInputValue(value)
  }, [])

  const deferredInputValue = useDeferredValue(inputValue)
  const searchOptions = useSearchOptions({
    inputValue: deferredInputValue,
    skip: !focused
  })
  const options = useMemo(
    () => [
      ...searchOptions.datasets,
      ...searchOptions.buildings,
      ...searchOptions.areas
    ],
    [searchOptions.datasets, searchOptions.buildings, searchOptions.areas]
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

  const [tab, setTab] = useState(0)
  const deferredTab = useDeferredValue(tab)
  const handleTabChange = useCallback((event: unknown, value: number) => {
    setTab(value)
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
          filterOptions={filterOptions}
          maxHeight={maxMainHeight}
          onFocus={handleFocus}
          onChange={handleChange}
          onInputChange={handleInputChange}
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
              <StyledTabs value={deferredTab} onChange={handleTabChange}>
                <Tab label='検索' />
                <Tab label='都道府県' />
                <Tab label='カテゴリー' />
              </StyledTabs>
              {tab === 0 && (
                <SearchList
                  datasets={searchOptions.datasets}
                  buildings={searchOptions.buildings}
                  areas={searchOptions.areas}
                  onOptionSelect={handleOptionSelect}
                  onFiltersChange={handleFiltersChange}
                />
              )}
              {tab === 1 && <DatasetAreaList />}
              {tab === 2 && <DatasetTypeList />}
            </StyledScrollable>
          )}
        </SearchAutocomplete>
      </FloatingPanel>
    </ClickAwayListener>
  )
}
