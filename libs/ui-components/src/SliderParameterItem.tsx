import { Slider, styled, type SliderProps } from '@mui/material'
import { scaleLinear } from 'd3'
import { useAtom, type PrimitiveAtom } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes
} from 'react'

import { ParameterItem } from './ParameterItem'

const StyledSlider = styled(Slider)({
  width: 'calc(100% - 12px)',
  marginTop: -6,
  marginRight: 6,
  marginLeft: 6
})

const Value = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums'
}))

export interface SliderParameterItemProps<
  T extends number | number[] = number | number[]
> extends PropsWithoutRef<Omit<SliderProps, 'value'>> {
  label?: ReactNode
  description?: ReactNode
  decimalPlaces?: number
  unit?: ReactNode
  atom: PrimitiveAtom<T>
}

export const SliderParameterItem = forwardRef<
  HTMLDivElement,
  SliderParameterItemProps
>(
  (
    {
      label,
      description,
      min = 0,
      max = 10,
      decimalPlaces = 0,
      unit,
      atom,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useAtom(atom)

    const handleChange = useCallback(
      (event: Event, value: number | number[], activeThumb: number) => {
        setValue(value)
        onChange?.(event, value, activeThumb)
      },
      [onChange, setValue]
    )

    const marks = useMemo(
      () =>
        scaleLinear()
          .domain([min, max])
          .ticks()
          .map(value => ({ value })),
      [min, max]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        description={description}
        control={
          <Value>
            {typeof value === 'number'
              ? value.toFixed(decimalPlaces)
              : value.map(value => value.toFixed(decimalPlaces)).join(' - ')}
            {unit != null && <> {unit}</>}
          </Value>
        }
      >
        <StyledSlider
          size='small'
          marks={marks}
          min={min}
          max={max}
          step={Number.EPSILON}
          disableSwap
          {...props}
          value={value}
          onChange={handleChange}
        />
      </ParameterItem>
    )
  }
) as <T extends number | number[]>(
  props: SliderParameterItemProps<T> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
