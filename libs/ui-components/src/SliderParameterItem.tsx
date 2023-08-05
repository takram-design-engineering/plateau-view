import { Slider, sliderClasses, styled, type SliderProps } from '@mui/material'
import { scaleLinear } from 'd3'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  forwardRef,
  useCallback,
  useMemo,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes
} from 'react'

import { formatValue, type ValueFormatter } from './helpers/formatValue'
import { inversePseudoLog, pseudoLog } from './helpers/pseudoLog'
import { ParameterItem, type ParameterItemProps } from './ParameterItem'

const StyledSlider = styled(Slider, {
  shouldForwardProp: prop => prop !== 'mixed'
})<{ mixed?: boolean }>(({ mixed = false }) => ({
  width: 'calc(100% - 12px)',
  marginTop: -6,
  marginRight: 6,
  marginLeft: 6,
  ...(mixed && {
    [`& .${sliderClasses.thumb}`]: {
      display: 'none'
    },
    [`& .${sliderClasses.track}`]: {
      display: 'none'
    }
  })
}))

const Value = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  fontVariantNumeric: 'tabular-nums'
}))

export interface SliderParameterItemProps<Range extends boolean = false>
  extends PropsWithoutRef<Omit<SliderProps, 'value' | 'step'>>,
    Pick<ParameterItemProps, 'label' | 'labelFontSize' | 'description'> {
  step?: number
  range?: Range
  format?: ValueFormatter
  unit?: ReactNode
  logarithmic?: boolean
  logarithmicBase?: number
  atom: Range extends true
    ? PrimitiveAtom<number[]> | Array<PrimitiveAtom<number[]>>
    : PrimitiveAtom<number> | Array<PrimitiveAtom<number>>
}

interface InternalSliderParameterItemProps
  extends Omit<SliderParameterItemProps, 'atom' | 'range'> {
  range?: boolean
  atom:
    | PrimitiveAtom<number | number[]>
    | Array<PrimitiveAtom<number | number[]>>
}

const MIXED = 'MIXED'

export const SliderParameterItem = forwardRef<
  HTMLDivElement,
  InternalSliderParameterItemProps
>(
  (
    {
      label,
      labelFontSize,
      description,
      min = 0,
      max = 10,
      step = Number.EPSILON,
      range = false,
      format = formatValue,
      unit,
      logarithmic = false,
      logarithmicBase = 10,
      atom: atomOrAtoms,
      onChange,
      ...props
    },
    ref
  ) => {
    const mergedAtom = useMemo(
      () =>
        Array.isArray(atomOrAtoms)
          ? atom(
              (get): number | number[] | typeof MIXED | null => {
                if (atomOrAtoms.length === 0) {
                  return null
                }
                const values = atomOrAtoms.map(atom => get(atom))
                const [value] = values
                return Array.isArray(value)
                  ? values.every(
                      another =>
                        Array.isArray(another) &&
                        another[0] === value[0] &&
                        another[1] === value[1]
                    )
                    ? value
                    : MIXED
                  : values.every(another => another === value)
                  ? value
                  : MIXED
              },
              (get, set, value: SetStateAction<number | number[]>) => {
                atomOrAtoms.forEach(atom => {
                  set(atom, value)
                })
              }
            )
          : atomOrAtoms,
      [atomOrAtoms]
    )
    const [value, setValue] = useAtom(mergedAtom)

    const handleChange = useCallback(
      (event: Event, value: number | number[], activeThumb: number) => {
        if (Array.isArray(value) && value.length !== 2) {
          return
        }
        if (logarithmic) {
          const scaledValue = logarithmic
            ? inversePseudoLog(value, logarithmicBase)
            : value
          const stepValue = Array.isArray(scaledValue)
            ? (scaledValue.map(value => Math.round(value / step) * step) as [
                number,
                number
              ])
            : Math.round(scaledValue / step) * step
          setValue(stepValue)
          onChange?.(event, stepValue, activeThumb)
        } else {
          setValue(value as number[])
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
      () =>
        value != null && value !== MIXED
          ? logarithmic
            ? pseudoLog(value, logarithmicBase)
            : value
          : range
          ? [0, 0]
          : 0,
      [range, logarithmic, logarithmicBase, value]
    )

    return (
      <ParameterItem
        ref={ref}
        label={label}
        labelFontSize={labelFontSize}
        description={description}
        control={
          <Value>
            {value === MIXED
              ? '混在'
              : value != null && (
                  <>
                    {typeof value === 'number' ? (
                      format(value)
                    ) : (
                      <>
                        {format(value[0])} ~ {format(value[1])}
                      </>
                    )}
                    {unit != null && <> {unit}</>}
                  </>
                )}
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
          mixed={value === MIXED}
        />
      </ParameterItem>
    )
  }
) as <Range extends boolean = false>(
  props: SliderParameterItemProps<Range> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
