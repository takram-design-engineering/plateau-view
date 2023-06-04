import { Slider, sliderClasses, styled, type SliderProps } from '@mui/material'
import { scaleTime, timeMonth } from 'd3'
import { format } from 'date-fns'
import { forwardRef, useMemo } from 'react'
import { type SetRequired } from 'type-fest'

const Root = styled(Slider)(({ theme }) => {
  const borderRadius = 6
  const thumbSize = 12
  return {
    width: `calc(100% - ${thumbSize}px)`,
    marginLeft: thumbSize / 2,
    marginBottom: 0,
    borderRadius,
    [`& .${sliderClasses.thumb}`]: {
      width: thumbSize,
      height: '100%',
      borderRadius
    },
    [`& .${sliderClasses.mark}`]: {
      display: 'none'
    },
    [`& .${sliderClasses.markLabel}`]: {
      ...theme.typography.caption,
      top: '50%',
      // Proportional to the slider width, and also not as large to overflow
      // too much.
      width: '1%',
      transform: `translate(0, -50%)`,
      lineHeight: 1.2
    },
    [`& .${sliderClasses.rail}`]: {
      height: '100%',
      width: `calc(100% + ${thumbSize}px)`,
      marginRight: -thumbSize / 2,
      marginLeft: -thumbSize / 2,
      backgroundColor: theme.palette.text.primary,
      opacity: theme.palette.action.hoverOpacity
    },
    [`& .${sliderClasses.track}`]: {
      height: '100%',
      marginLeft: -thumbSize / 2,
      paddingLeft: thumbSize / 2,
      border: 0,
      backgroundColor: theme.palette.text.primary,
      opacity: theme.palette.action.hoverOpacity,
      // TODO: Address ranged value style.
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
  }
})

const Label = styled('div')({
  textAlign: 'center'
})

export interface DateSliderProps
  extends SetRequired<SliderProps, 'min' | 'max'> {}

export const DateSlider = forwardRef<HTMLDivElement, DateSliderProps>(
  ({ min, max, ...props }, ref) => {
    // TODO: Support vertical orientation.
    const marks = useMemo(() => {
      const scale = scaleTime().domain([min, max])
      const interval = timeMonth.every(1)
      const ticks = interval != null ? scale.ticks(interval) : scale.ticks()
      // Width of the mark labels are proportional to the slider width with
      // a constant factor.
      const percentFactor = 10000 / (max - min)
      const widths = ticks.map(
        (tick, index) =>
          `${(+(ticks[index + 1] ?? max) - +tick) * percentFactor}%`
      )
      return ticks.map((value, index) => ({
        value: +value,
        label: (
          <Label style={{ width: widths[index] }}>{format(value, 'MMM')}</Label>
        )
      }))
    }, [min, max])
    return <Root ref={ref} min={min} max={max} {...props} marks={marks} />
  }
)
