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

import { ParameterItem, type ParameterItemProps } from './ParameterItem'
import { inversePseudoLog, pseudoLog } from './helpers/pseudoLog'

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
> extends PropsWithoutRef<Omit<SliderProps, 'value' | 'step'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  step?: number
  decimalPlaces?: number
  unit?: ReactNode
  logarithmic?: boolean
  logarithmicBase?: number
  atom: PrimitiveAtom<T>
}

export const SliderParameterItem = forwardRef<
  HTMLDivElement,
  SliderParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
      min = 0,
      max = 10,
      step = Number.EPSILON,
      decimalPlaces = 0,
      unit,
      logarithmic = false,
      logarithmicBase = 10,
      atom,
      onChange,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useAtom(atom)

    const handleChange = useCallback(
      (event: Event, value: number | number[], activeThumb: number) => {
        if (logarithmic) {
          const scaledValue = logarithmic
            ? inversePseudoLog(value, logarithmicBase)
            : value
          const stepValue = Array.isArray(scaledValue)
            ? scaledValue.map(value => Math.round(value / step) * step)
            : Math.round(scaledValue / step) * step
          setValue(stepValue)
          onChange?.(event, stepValue, activeThumb)
        } else {
          setValue(value)
          onChange?.(event, value, activeThumb)
        }
      },
      [logarithmic, logarithmicBase, onChange, setValue, step]
    )

    const marks = useMemo(
      () =>
        scaleLinear()
          .domain([min, max])
          .ticks()
          .map(
            logarithmic
              ? value => ({ value: pseudoLog(value, logarithmicBase) })
              : value => ({ value })
          ),
      [min, max, logarithmic, logarithmicBase]
    )

    const scaledMin = useMemo(
      () => (logarithmic ? pseudoLog(min, logarithmicBase) : min),
      [min, logarithmic, logarithmicBase]
    )
    const scaledMax = useMemo(
      () => (logarithmic ? pseudoLog(max, logarithmicBase) : max),
      [max, logarithmic, logarithmicBase]
    )
    const scaledValue = useMemo(
      () => (logarithmic ? pseudoLog(value, logarithmicBase) : value),
      [value, logarithmic, logarithmicBase]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        control={
          <Value>
            {typeof value === 'number'
              ? value.toFixed(decimalPlaces)
              : value.map(value => value.toFixed(decimalPlaces)).join(' ~ ')}
            {unit != null && <> {unit}</>}
          </Value>
        }
      >
        <StyledSlider
          size='small'
          marks={marks}
          min={scaledMin}
          max={scaledMax}
          step={logarithmic ? Number.EPSILON : step}
          disableSwap
          {...props}
          value={scaledValue}
          onChange={handleChange}
        />
      </ParameterItem>
    )
  }
) as <T extends number | number[]>(
  props: SliderParameterItemProps<T> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
