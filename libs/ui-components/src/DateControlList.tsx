import { List, Stack, type StackProps } from '@mui/material'
import {
  Body,
  SearchHourAngle,
  SearchRiseSet,
  Seasons,
  type Observer
} from 'astronomy-engine'
import { format, set, startOfDay } from 'date-fns'
import { useCallback, useMemo, useRef, type FC, type MouseEvent } from 'react'

import { DateControlListItem } from './DateControlListItem'

function findCulmination(
  body: Body,
  observer: Observer,
  referenceDate: Date
): Date {
  const date = startOfDay(referenceDate)
  const hourAngle = SearchHourAngle(body, observer, 0, date)
  return hourAngle.time.date
}

export interface RiseSet {
  rise?: Date
  set?: Date
}

function findRiseSet(
  body: Body,
  observer: Observer,
  referenceDate: Date
): RiseSet {
  const date = startOfDay(referenceDate)
  const rise = SearchRiseSet(body, observer, 1, date, 1)
  const set = SearchRiseSet(body, observer, -1, date, 1)
  return { rise: rise?.date, set: set?.date }
}

export interface Solstices {
  summer: Date
  winter: Date
}

function findSolstices(year: number): Solstices {
  const seasons = Seasons(year)
  const summer = seasons.jun_solstice.date
  const winter = seasons.dec_solstice.date
  return { summer, winter }
}

export interface DateControlListProps extends Omit<StackProps, 'onChange'> {
  date: Date
  observer: Observer
  onChange?: (event: MouseEvent<HTMLDivElement>, date: Date) => void
}

export const DateControlList: FC<DateControlListProps> = ({
  date,
  observer,
  onChange,
  ...props
}) => {
  const { summerSolstice, winterSolstice } = useMemo(() => {
    const { summer, winter } = findSolstices(date.getFullYear())
    return {
      summerSolstice: summer,
      winterSolstice: winter
    }
  }, [date])

  const { culmination, sunrise, sunset } = useMemo(() => {
    const culmination = findCulmination(Body.Sun, observer, date)
    const { rise, set } = findRiseSet(Body.Sun, observer, date)
    const { summer, winter } = findSolstices(date.getFullYear())
    return {
      culmination,
      sunrise: rise,
      sunset: set,
      summerSolstice: summer,
      winterSolstice: winter
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
