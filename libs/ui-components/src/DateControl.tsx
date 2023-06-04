import { Stack, styled } from '@mui/material'
import { Observer } from 'astronomy-engine'
import { endOfYear, format, startOfYear } from 'date-fns'
import {
  forwardRef,
  useCallback,
  type ComponentPropsWithRef,
  type SyntheticEvent
} from 'react'
import invariant from 'tiny-invariant'

import { useConstant } from '@takram/plateau-react-helpers'

import { DateControlGraph } from './DateControlGraph'
import { DateControlList } from './DateControlList'
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

    const handleSliderChange = useCallback(
      (event: Event, value: number | number[]) => {
        invariant(!Array.isArray(value))
        onChange?.(event, new Date(value))
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
            <DateControlGraph />
          </Stack>
        </Stack>
      </Root>
    )
  }
)
