import {
  ToggleButton,
  ToggleButtonGroup,
  styled,
  type ToggleButtonGroupProps,
  type ToggleButtonProps
} from '@mui/material'
import { useAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  type MouseEvent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes
} from 'react'

import { ParameterItem } from './ParameterItem'

const StyledToggleButton = styled(ToggleButton)({
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

export interface SegmentParameterItemProps<
  T extends string | number = string | number,
  Exclusive extends boolean = boolean
> extends PropsWithoutRef<Omit<ToggleButtonGroupProps, 'value'>> {
  label?: ReactNode
  description?: ReactNode
  exclusive?: Exclusive
  atom: PrimitiveAtom<Exclusive extends true ? T : T[]>
  items?: ReadonlyArray<
    [T, ReactNode] | [T, ReactNode, Partial<ToggleButtonProps>]
  >
}

export const SegmentParameterItem = forwardRef<
  HTMLDivElement,
  SegmentParameterItemProps
>(
  (
    {
      label,
      description,
      exclusive = false,
      atom,
      items,
      onChange,
      children,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useAtom(atom)

    const handleChange = useCallback(
      (
        event: MouseEvent<HTMLElement>,
        value: (string | number) | Array<string | number>
      ) => {
        setValue(value)
        onChange?.(event, value)
      },
      [onChange, setValue]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        description={description}
        gutterBottom
      >
        <ToggleButtonGroup
          size='small'
          fullWidth
          {...props}
          exclusive={exclusive}
          value={value}
          onChange={handleChange}
        >
          {items != null
            ? items.map(([value, content, props]) => (
                <StyledToggleButton {...props} key={value} value={value}>
                  {content}
                </StyledToggleButton>
              ))
            : children}
        </ToggleButtonGroup>
      </ParameterItem>
    )
  }
) as <T extends string | number, Exclusive extends boolean = false>(
  props: SegmentParameterItemProps<T, Exclusive> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
