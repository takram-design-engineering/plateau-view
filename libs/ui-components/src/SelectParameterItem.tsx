import {
  Select,
  styled,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes
} from 'react'

import { ParameterItem, type ParameterItemProps } from './ParameterItem'
import { SelectItem, type SelectItemProps } from './SelectItem'

const StyledSelect = styled(Select)(({ theme, fullWidth }) => ({
  ...(fullWidth === true && {
    width: `calc(100% - ${theme.spacing(-2)})`,
    marginLeft: theme.spacing(-1)
  })
})) as unknown as typeof Select // For generics

const Value = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
}))

export interface SelectParameterItemProps<
  T extends string | number | null = string | number | null
> extends PropsWithoutRef<Omit<SelectProps<T>, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  layout?: 'inline' | 'stack'
  atom: PrimitiveAtom<T> | Array<PrimitiveAtom<T>>
  items?: ReadonlyArray<
    [T, ReactNode] | [T, ReactNode, Partial<SelectItemProps>]
  >
}

const MIXED = 'MIXED'

export const SelectParameterItem = forwardRef<
  HTMLDivElement,
  SelectParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
      layout = 'inline',
      atom: atomOrAtoms,
      items,
      onChange,
      children,
      ...props
    },
    ref
  ) => {
    const mergedAtom = useMemo(
      () =>
        Array.isArray(atomOrAtoms)
          ? atom(
              get => {
                if (atomOrAtoms.length === 0) {
                  return null
                }
                const values = atomOrAtoms.map(atom => get(atom))
                const [value] = values
                return values.slice(1).every(another => another === value)
                  ? value
                  : MIXED
              },
              (get, set, value: SetStateAction<string | number | null>) => {
                atomOrAtoms.forEach(atom => {
                  set(atom, value)
                })
              }
            )
          : atomOrAtoms,
      [atomOrAtoms]
    )
    const [value, setValue] = useAtom(mergedAtom)

    const hasNullValueItem = useMemo(
      () => items?.some(([value]) => value === null) ?? false,
      [items]
    )

    const handleChange = useCallback(
      (event: SelectChangeEvent<string | number | null>, child: ReactNode) => {
        setValue(
          hasNullValueItem && event.target.value === ''
            ? null
            : event.target.value
        )
        onChange?.(event, child)
      },
      [onChange, setValue, hasNullValueItem]
    )

    const select = (
      <StyledSelect
        {...props}
        variant='filled'
        fullWidth={layout === 'stack'}
        value={value !== null ? value : ''}
        onChange={handleChange}
      >
        {value === MIXED && (
          <SelectItem value={MIXED}>
            <Value>混在</Value>
          </SelectItem>
        )}
        {items != null
          ? items.map(([value, content, props]) => (
              <SelectItem
                {...props}
                key={value}
                value={value !== null ? value : ''}
              >
                <Value>{content}</Value>
              </SelectItem>
            ))
          : children}
      </StyledSelect>
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        {...(layout === 'inline'
          ? { control: select, controlSpace: 'button' }
          : { gutterBottom: true })}
      >
        {layout === 'stack' && select}
      </ParameterItem>
    )
  }
) as <T extends string | number | null>(
  props: SelectParameterItemProps<T> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
