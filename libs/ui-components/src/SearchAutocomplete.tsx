import {
  Autocomplete,
  autocompleteClasses,
  Chip,
  createSvgIcon,
  Divider,
  inputAdornmentClasses,
  ListSubheader,
  styled,
  type AutocompleteGetTagProps,
  type AutocompleteOwnerState,
  type AutocompleteRenderGroupParams,
  type AutocompleteRenderInputParams,
  type AutocompleteRenderOptionState,
  type AutocompleteProps as MuiAutocompleteProps,
  type PopperProps
} from '@mui/material'
import { omit } from 'lodash'
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type FocusEvent,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactNode
} from 'react'
import invariant from 'tiny-invariant'

import { EntityTitleButton } from './EntityTitleButton'
import { AddressIcon, BuildingIcon, DatasetIcon, HistoryIcon } from './icons'
import { SearchField } from './SearchField'
import { SearchListbox } from './SearchListbox'

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  maxHeight: '100%',
  [`& .${autocompleteClasses.input}`]: {
    marginLeft: theme.spacing(1)
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    maxHeight: 'none'
  },
  [`& .${autocompleteClasses.endAdornment}`]: {
    top: '50%',
    transform: 'translateY(-50%)'
  },
  [`& .${inputAdornmentClasses.positionStart}`]: {
    marginRight: 0
  }
}))

const PopperRoot = styled('div')({
  flexGrow: 1
})

const PopperComponent = forwardRef<HTMLDivElement, PopperProps>(
  ({ children, open }, ref) => {
    invariant(typeof children !== 'function')
    return open ? (
      <>
        <Divider />
        <PopperRoot ref={ref}>{children}</PopperRoot>
      </>
    ) : null
  }
)

const PaperRoot = styled('div')({
  height: '100%'
})

const PaperComponent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => (
  <PaperRoot ref={ref} {...props}>
    {children}
  </PaperRoot>
))

const StyledChip = styled(Chip)(({ theme }) => ({
  ...theme.typography.body2
}))

const CloseIcon = createSvgIcon(
  <path d='M17.6 7.53L16.47 6.4 12 10.87 7.53 6.4 6.4 7.53 10.87 12 6.4 16.47l1.13 1.13L12 13.13l4.47 4.47 1.13-1.13L13.13 12l4.47-4.47z' />,
  'Close'
)

export type SearchOptionType =
  | 'filter'
  | 'history'
  | 'dataset'
  | 'building'
  | 'address'

function isSearchOptionType(
  value: unknown
): value is Exclude<SearchOptionType, 'filter'> {
  return (
    value === 'history' ||
    value === 'dataset' ||
    value === 'building' ||
    value === 'address'
  )
}

export interface SearchOption {
  type: SearchOptionType
  id?: string
  name: string
}

const iconComponents: Record<
  Exclude<SearchOptionType, 'filter'>,
  ComponentType
> = {
  history: HistoryIcon,
  dataset: DatasetIcon,
  building: BuildingIcon,
  address: AddressIcon
}

const groupNames: Record<Exclude<SearchOptionType, 'filter'>, string> = {
  history: '最近の検索',
  dataset: 'データセット',
  building: '建築物',
  address: '住所'
}

function getOptionLabel(value: string | SearchOption): string {
  return typeof value === 'string' ? value : value.name
}

function renderGroup(params: AutocompleteRenderGroupParams): ReactNode {
  return [
    <ListSubheader component='div'>
      {isSearchOptionType(params.group)
        ? groupNames[params.group]
        : params.group}
    </ListSubheader>,
    params.children
  ]
}

function renderOption(
  props: HTMLAttributes<HTMLLIElement>,
  option: SearchOption,
  state: AutocompleteRenderOptionState
): ReactNode {
  return (
    // @ts-expect-error TODO
    <EntityTitleButton
      title={option.name}
      // @ts-expect-error TODO
      iconComponent={iconComponents[option.type]}
      {...props}
    />
  )
}

function renderTags(
  values: readonly SearchOption[],
  getTagProps: AutocompleteGetTagProps,
  ownerState: AutocompleteOwnerState<
    SearchOption,
    true,
    false,
    true,
    typeof Chip
  >
): ReactNode {
  return values.map((value, index) => (
    <StyledChip
      label={value.name}
      {...getTagProps({ index })}
      size='small'
      deleteIcon={<CloseIcon />}
    />
  ))
}

function groupBy(option: SearchOption): string {
  return option.type
}

type AutocompleteProps = MuiAutocompleteProps<
  SearchOption,
  true, // Multiple
  false, // DisableClearable
  true // FreeSolo
>

export type SearchAutocompleteProps = Omit<AutocompleteProps, 'renderInput'> & {
  inputRef?: ForwardedRef<HTMLInputElement>
  placeholder?: ReactNode
  endAdornment?: ReactNode
  maxHeight?: number
  filters?: string[]
  children?: ReactNode
}

export const SearchAutocomplete = forwardRef<
  HTMLInputElement,
  SearchAutocompleteProps
>(
  (
    {
      inputRef,
      open: openProp = false,
      placeholder,
      endAdornment,
      maxHeight,
      options,
      filters,
      children,
      onChange,
      onInputChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(true)
        onFocus?.(event)
      },
      [onFocus]
    )
    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false)
        onBlur?.(event)
      },
      [onBlur]
    )

    const renderInput = useCallback(
      (params: AutocompleteRenderInputParams) => (
        <SearchField
          inputRef={inputRef}
          placeholder={placeholder}
          {...params}
          InputProps={{
            ...omit(params.InputProps, ['startAdornment', 'endAdornment']),
            ...(params.InputProps.startAdornment != null
              ? { startAdornment: params.InputProps.startAdornment }
              : {}),
            ...(params.InputProps.endAdornment != null || focused
              ? { endAdornment: params.InputProps.endAdornment }
              : { endAdornment })
          }}
        />
      ),
      [inputRef, placeholder, endAdornment, focused]
    )

    const [value, setValue] = useState<Array<string | SearchOption>>([])
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
      setValue(
        filters?.map(filter => ({
          type: 'filter' as const,
          id: filter,
          name: groupNames[filter as keyof typeof groupNames]
        })) ?? []
      )
    }, [filters])

    const filteredOptions = useMemo(() => {
      if (value.length === 0) {
        return options
      }
      const filters = value
        .filter(
          (value: string | SearchOption): value is SearchOption =>
            typeof value !== 'string'
        )
        .map(({ id }) => id)
      return options.filter(option => filters.includes(option.type))
    }, [options, value])

    const handleChange: NonNullable<AutocompleteProps['onChange']> =
      useCallback(
        (event, value, reason, details) => {
          if (reason === 'createOption') {
            return // Disable free solo here.
          } else if (reason === 'removeOption') {
            setValue([])
          }
          onChange?.(event, value, reason, details)
        },
        [onChange]
      )

    const handleInputChange: NonNullable<AutocompleteProps['onInputChange']> =
      useCallback(
        (event, value, reason) => {
          if (reason === 'reset') {
            setFocused(false)
            return // Disable auto clear
          }
          setInputValue(value)
          onInputChange?.(event, value, reason)
        },
        [onInputChange]
      )

    const open = openProp || value.length > 0 || (focused && inputValue !== '')
    return (
      <Root>
        <Autocomplete
          ref={ref}
          fullWidth
          multiple
          freeSolo
          disablePortal
          PopperComponent={PopperComponent}
          PaperComponent={PaperComponent}
          ListboxComponent={SearchListbox}
          ListboxProps={{
            // @ts-expect-error Override prop type
            maxHeight
          }}
          {...props}
          open={open}
          options={filteredOptions}
          value={value}
          inputValue={inputValue}
          getOptionLabel={getOptionLabel}
          groupBy={groupBy}
          renderInput={renderInput}
          renderGroup={renderGroup}
          renderOption={renderOption}
          renderTags={renderTags}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!open && children}
      </Root>
    )
  }
)
