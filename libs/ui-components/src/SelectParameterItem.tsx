import {
  Select,
  Typography,
  styled,
  type SelectChangeEvent,
  type SelectProps
} from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
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

const StyledSelect = styled(Select)(({ theme }) => ({
  marginRight: theme.spacing(-1)
})) as unknown as typeof Select // For generics

export interface SelectParameterItemProps<
  T extends string | number | null = string | number | null
> extends PropsWithoutRef<Omit<SelectProps<T>, 'value'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  layout?: 'inline' | 'stack'
  atom: PrimitiveAtom<T>
  items?: ReadonlyArray<
    [T, ReactNode] | [T, ReactNode, Partial<SelectItemProps>]
  >
}

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
      atom,
      items,
      onChange,
      children,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useAtom(atom)

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
        {...(layout === 'inline'
          ? { variant: 'filled' }
          : { variant: 'outlined', fullWidth: true })}
        {...props}
        value={value !== null ? value : ''}
        onChange={handleChange}
      >
        {items != null
          ? items.map(([value, content, props]) => (
              <SelectItem
                {...props}
                key={value}
                value={value !== null ? value : ''}
              >
                <Typography variant='body2'>{content}</Typography>
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
          ? { control: select }
          : { gutterBottom: true })}
      >
        {layout === 'stack' && select}
      </ParameterItem>
    )
  }
) as <T extends string | number | null>(
  props: SelectParameterItemProps<T> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
