import { List, Stack, type StackProps } from '@mui/material'
import { format, set } from 'date-fns'
import { useCallback, useRef, type FC, type MouseEvent } from 'react'

import { DateControlListItem } from './DateControlListItem'
import { type DateControlState } from './useDateControlState'

export interface DateControlListProps
  extends Omit<StackProps, 'onChange'>,
    DateControlState {
  date: Date
  onChange?: (event: MouseEvent<HTMLDivElement>, date: Date) => void
}

export const DateControlList: FC<DateControlListProps> = ({
  date,
  summerSolstice,
  winterSolstice,
  culmination,
  sunrise,
  sunset,
  onChange,
  ...props
}) => {
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
