import {
  Popover,
  Slider,
  sliderClasses,
  styled,
  type SliderProps
} from '@mui/material'
import { scaleLinear } from 'd3'
import { atom, useAtom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

import { formatValue, type ValueFormatter } from './helpers/formatValue'
import { inversePseudoLog, pseudoLog } from './helpers/pseudoLog'
import {
  ParameterItemButton,
  type ParameterItemButtonProps
} from './ParameterItemButton'

const StyledSlider = styled(Slider, {
  shouldForwardProp: prop => prop !== 'mixed'
})<{ mixed?: boolean }>(({ theme, mixed = false }) => ({
  width: `calc(100% - ${theme.spacing(2)})`,
  marginRight: theme.spacing(1),
  marginLeft: theme.spacing(1),
  marginBottom: 14,
  [`& .${sliderClasses.markLabel}`]: {
    ...theme.typography.caption,
    lineHeight: 1
  },
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

const PopoverContent = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`
}))

export interface SliderParameterItemProps<Range extends boolean = false>
  extends PropsWithoutRef<Omit<SliderProps, 'value' | 'step'>>,
    Pick<ParameterItemButtonProps, 'label' | 'labelFontSize' | 'description'> {
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
    forwardedRef
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
          .ticks(4)
          .map(
            logarithmic
              ? value => ({ value: pseudoLog(value, logarithmicBase) })
              : value => ({ value, label: format(value) })
          ),
      [min, max, logarithmic, logarithmicBase, format]
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

    const id = useId()
    const popupState = usePopupState({
      variant: 'popover',
      popupId: id
    })

    const ref = useRef<HTMLDivElement>(null)
    const [width, setWidth] = useState<number>()
    useEffect(() => {
      invariant(ref.current != null)
      const observer = new ResizeObserver(([entry]) => {
        setWidth(entry.contentRect.width)
      })
      observer.observe(ref.current)
      return () => {
        observer.disconnect()
      }
    }, [])

    return (
      <>
        <ParameterItemButton
          ref={mergeRefs([ref, forwardedRef])}
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
          {...bindTrigger(popupState)}
        />
        <Popover
          {...bindPopover(popupState)}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom'
          }}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'top'
          }}
          marginThreshold={8}
        >
          <PopoverContent sx={{ width }}>
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
          </PopoverContent>
        </Popover>
      </>
    )
  }
) as <Range extends boolean = false>(
  props: SliderParameterItemProps<Range> & RefAttributes<HTMLDivElement>
) => JSX.Element // For generics
