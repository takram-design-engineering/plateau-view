import { Stack, styled } from '@mui/material'
import { endOfYear, format, set, startOfDay, startOfYear } from 'date-fns'
import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithRef,
  type SyntheticEvent
} from 'react'
import invariant from 'tiny-invariant'

import { DateControlList } from './DateControlList'
import { DateControlSliderGraph } from './DateControlSliderGraph'
import { DateSlider } from './DateSlider'
import {
  useDateControlState,
  type DateControlStateParams
} from './useDateControlState'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  paddingRight: theme.spacing(6),
  paddingBottom: theme.spacing(5)
}))

const DateText = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  fontVariantNumeric: 'tabular-nums'
}))

const TimeText = styled('div')(({ theme }) => ({
  ...theme.typography.h4,
  fontVariantNumeric: 'tabular-nums'
}))

export interface DateControlProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'children' | 'onChange'>,
    DateControlStateParams {
  onChange?: (event: SyntheticEvent | Event, date: Date) => void
}

export const DateControl = forwardRef<HTMLDivElement, DateControlProps>(
  ({ date, longitude, latitude, height, onChange, ...props }, ref) => {
    const state = useDateControlState({
      date,
      longitude,
      latitude,
      height
    })

    const dateRef = useRef(date)
    dateRef.current = date

    const handleSliderChange = useCallback(
      (event: Event, value: number | number[]) => {
        invariant(!Array.isArray(value))
        const date = new Date(value)
        onChange?.(
          event,
          set(dateRef.current, {
            month: date.getMonth(),
            date: date.getDate()
          })
        )
      },
      [onChange]
    )

    const handleGraphSliderChange = useCallback(
      (event: Event, value: number | number[]) => {
        invariant(!Array.isArray(value))
        const date = new Date(value)
        onChange?.(
          event,
          set(dateRef.current, {
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
            milliseconds: date.getMilliseconds()
          })
        )
      },
      [onChange]
    )

    return (
      <Root ref={ref} {...props}>
        <Stack direction='row' spacing={3} width='100%'>
          <Stack spacing={2} width={200}>
            <Stack spacing={0.5}>
              <DateText>{format(date, 'MMMM d, yyyy')}</DateText>
              <TimeText>{format(date, 'HH:mm')}</TimeText>
            </Stack>
            <DateControlList {...state} onChange={onChange} />
          </Stack>
          <Stack width='100%' spacing={2}>
            <DateSlider
              min={+startOfYear(date)}
              max={+startOfDay(endOfYear(date))}
              value={+startOfDay(date)}
              onChange={handleSliderChange}
            />
            <DateControlSliderGraph
              {...state}
              onChange={handleGraphSliderChange}
            />
          </Stack>
        </Stack>
      </Root>
    )
  }
)
