import { Stack, styled } from '@mui/material'
import { Observer, Seasons } from 'astronomy-engine'
import { endOfYear, format, set, startOfYear } from 'date-fns'
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  type ComponentPropsWithRef,
  type SyntheticEvent
} from 'react'
import invariant from 'tiny-invariant'

import { useConstant } from '@takram/plateau-react-helpers'

import { DateControlList } from './DateControlList'
import { DateControlSliderGraph } from './DateControlSliderGraph'
import { DateSlider } from './DateSlider'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3)
}))

const DateText = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  fontVariantNumeric: 'tabular-nums'
}))

const TimeText = styled('div')(({ theme }) => ({
  ...theme.typography.h4,
  fontVariantNumeric: 'tabular-nums'
}))

function findSolstices(year: number): {
  summer: Date
  winter: Date
} {
  const seasons = Seasons(year)
  const summer = seasons.jun_solstice.date
  const winter = seasons.dec_solstice.date
  return { summer, winter }
}

export interface DateControlProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'children' | 'onChange'> {
  date: Date
  longitude: number
  latitude: number
  height?: number
  onChange?: (event: SyntheticEvent | Event, date: Date) => void
}

export const DateControl = forwardRef<HTMLDivElement, DateControlProps>(
  ({ date, longitude, latitude, height = 0, onChange, ...props }, ref) => {
    const observer = useConstant(
      () => new Observer(latitude, longitude, height)
    )
    observer.longitude = longitude
    observer.latitude = latitude
    observer.height = height

    const { summer: summerSolstice, winter: winterSolstice } = useMemo(
      () => findSolstices(date.getFullYear()),
      [date]
    )

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
            <DateControlList
              date={date}
              observer={observer}
              summerSolstice={summerSolstice}
              winterSolstice={winterSolstice}
              onChange={onChange}
            />
          </Stack>
          <Stack width='100%' spacing={2}>
            <DateSlider
              min={+startOfYear(date)}
              max={+endOfYear(date)}
              value={+date}
              onChange={handleSliderChange}
            />
            <DateControlSliderGraph
              date={date}
              observer={observer}
              summerSolstice={summerSolstice}
              winterSolstice={winterSolstice}
              onChange={handleGraphSliderChange}
            />
          </Stack>
        </Stack>
      </Root>
    )
  }
)
