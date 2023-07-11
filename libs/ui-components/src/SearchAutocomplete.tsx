import {
  Autocomplete,
  autocompleteClasses,
  Chip,
  createSvgIcon,
  Divider,
  inputAdornmentClasses,
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
  useState,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode
} from 'react'
import invariant from 'tiny-invariant'

import { EntityTitleButton } from './EntityTitleButton'
import { AddressIcon, BuildingIcon, DatasetIcon } from './icons'
import { SearchField } from './SearchField'
import { SearchListbox } from './SearchListbox'
import { SearchListGroup } from './SearchListGroup'

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
        <Divider light />
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

export type SearchInputType = 'dataset' | 'building' | 'address'

function isSearchInputType(value: unknown): value is SearchInputType {
  return value === 'dataset' || value === 'building' || value === 'address'
}

export interface SearchInputValue {
  type: SearchInputType
  name: string
}

const iconComponents: Record<SearchInputType, ComponentType> = {
  dataset: DatasetIcon,
  building: BuildingIcon,
  address: AddressIcon
}

const groupNames: Record<SearchInputType, string> = {
  dataset: 'データセット',
  building: '建築物',
  address: '住所'
}

function getOptionLabel(value: string | SearchInputValue): string {
  return typeof value === 'string' ? value : value.name
}

function renderGroup(params: AutocompleteRenderGroupParams): ReactNode {
  return [
    <SearchListGroup>
      {isSearchInputType(params.group)
        ? groupNames[params.group]
        : params.group}
    </SearchListGroup>,
    params.children
  ]
}

function renderOption(
  props: HTMLAttributes<HTMLLIElement>,
  option: SearchInputValue,
  state: AutocompleteRenderOptionState
): ReactNode {
  return (
    // @ts-expect-error TODO
    <EntityTitleButton
      title={option.name}
      iconComponent={iconComponents[option.type]}
      {...props}
    />
  )
}

function renderTags(
  values: readonly SearchInputValue[],
  getTagProps: AutocompleteGetTagProps,
  ownerState: AutocompleteOwnerState<
    SearchInputValue,
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

function groupBy(option: SearchInputValue): string {
  return option.type
}

type AutocompleteProps = MuiAutocompleteProps<
  SearchInputValue,
  true, // Multiple
  false, // DisableClearable
  true // FreeSolo
>

export type SearchAutocompleteProps = Omit<AutocompleteProps, 'renderInput'> & {
  placeholder?: ReactNode
  endAdornment?: ReactNode
  children?: ReactNode
}

export const SearchAutocomplete = forwardRef<
  HTMLInputElement,
  SearchAutocompleteProps
>(
  (
    { open: openProp = false, placeholder, endAdornment, children, ...props },
    ref
  ) => {
    const renderInput = useCallback(
      (params: AutocompleteRenderInputParams) => (
        <SearchField
          placeholder={placeholder}
          {...params}
          InputProps={{
            ...omit(params.InputProps, ['startAdornment', 'endAdornment']),
            ...(params.InputProps.startAdornment != null
              ? { startAdornment: params.InputProps.startAdornment }
              : {}),
            ...(params.InputProps.endAdornment != null
              ? { endAdornment: params.InputProps.endAdornment }
              : { endAdornment })
          }}
        />
      ),
      [placeholder, endAdornment]
    )

    const [value, setValue] = useState<Array<string | SearchInputValue>>([])
    const [inputValue, setInputValue] = useState('')

    const handleChange: NonNullable<AutocompleteProps['onChange']> =
      useCallback((event, value, reason, details) => {
        setValue(value)
      }, [])

    const handleInputChange: NonNullable<AutocompleteProps['onInputChange']> =
      useCallback((event, value, reason) => {
        setInputValue(value)
      }, [])

    const open = openProp || inputValue !== ''
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
          {...props}
          open={open}
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
        />
        {!open && children}
      </Root>
    )
  }
)
