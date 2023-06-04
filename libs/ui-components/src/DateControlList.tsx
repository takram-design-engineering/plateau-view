import { List, Stack, type StackProps } from '@mui/material'
import {
  Body,
  SearchHourAngle,
  SearchRiseSet,
  type Observer
} from 'astronomy-engine'
import { format, set, startOfDay } from 'date-fns'
import { useCallback, useMemo, useRef, type FC, type MouseEvent } from 'react'

import { DateControlListItem } from './DateControlListItem'

function findCulmination(referenceDate: Date, observer: Observer): Date {
  const date = startOfDay(referenceDate)
  const hourAngle = SearchHourAngle(Body.Sun, observer, 0, date)
  return hourAngle.time.date
}

export interface RiseSet {
  rise?: Date
  set?: Date
}

function findRiseSet(referenceDate: Date, observer: Observer): RiseSet {
  const date = startOfDay(referenceDate)
  const rise = SearchRiseSet(Body.Sun, observer, 1, date, 1)
  const set = SearchRiseSet(Body.Sun, observer, -1, date, 1)
  return { rise: rise?.date, set: set?.date }
}

export interface DateControlListProps extends Omit<StackProps, 'onChange'> {
  date: Date
  observer: Observer
  summerSolstice: Date
  winterSolstice: Date
  onChange?: (event: MouseEvent<HTMLDivElement>, date: Date) => void
}

export const DateControlList: FC<DateControlListProps> = ({
  date,
  observer,
  summerSolstice,
  winterSolstice,
  onChange,
  ...props
}) => {
  const { culmination, sunrise, sunset } = useMemo(() => {
    const culmination = findCulmination(date, observer)
    const { rise, set } = findRiseSet(date, observer)
    return {
      culmination,
      sunrise: rise,
      sunset: set
    }
  }, [date, observer])

  const dateRef = useRef(date)
  dateRef.current = date

  const handleSummerSolsticeClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(
        event,
        set(dateRef.current, {
          year: summerSolstice.getFullYear(),
          month: summerSolstice.getMonth(),
          date: summerSolstice.getDate()
        })
      )
    },
    [summerSolstice, onChange]
  )

  const handleWinterSolsticeClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(
        event,
        set(dateRef.current, {
          year: winterSolstice.getFullYear(),
          month: winterSolstice.getMonth(),
          date: winterSolstice.getDate()
        })
      )
    },
    [winterSolstice, onChange]
  )

  const handleCulminationClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(
        event,
        set(dateRef.current, {
          hours: culmination.getHours(),
          minutes: culmination.getMinutes(),
          seconds: culmination.getSeconds(),
          milliseconds: culmination.getMilliseconds()
        })
      )
    },
    [culmination, onChange]
  )

  const handleSunriseClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (sunrise == null) {
        return
      }
      onChange?.(
        event,
        set(dateRef.current, {
          hours: sunrise.getHours(),
          minutes: sunrise.getMinutes(),
          seconds: sunrise.getSeconds(),
          milliseconds: sunrise.getMilliseconds()
        })
      )
    },
    [sunrise, onChange]
  )

  const handleSunsetClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (sunset == null) {
        return
      }
      onChange?.(
        event,
        set(dateRef.current, {
          hours: sunset.getHours(),
          minutes: sunset.getMinutes(),
          seconds: sunset.getSeconds(),
          milliseconds: sunset.getMilliseconds()
        })
      )
    },
    [sunset, onChange]
  )

  return (
    <Stack spacing={2} {...props}>
      <List dense disablePadding>
        <DateControlListItem
          label='夏至'
          value={format(summerSolstice, 'MMMM d')}
          onClick={handleSummerSolsticeClick}
        />
        <DateControlListItem
          label='冬至'
          value={format(winterSolstice, 'MMMM d')}
          onClick={handleWinterSolsticeClick}
        />
      </List>
      <List dense disablePadding>
        <DateControlListItem
          label='南中'
          value={format(culmination, 'HH:mm')}
          onClick={handleCulminationClick}
        />
        <DateControlListItem
          label='日の出'
          value={sunrise != null ? format(sunrise, 'HH:mm') : ''}
          disabled={sunrise == null}
          onClick={handleSunriseClick}
        />
        <DateControlListItem
          label='日の入'
          value={sunset != null ? format(sunset, 'HH:mm') : ''}
          disabled={sunset == null}
          onClick={handleSunsetClick}
        />
      </List>
    </Stack>
  )
}
