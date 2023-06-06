import { List, Stack, type StackProps } from '@mui/material'
import { format, type set } from 'date-fns'
import { useAtomValue } from 'jotai'
import { useCallback, type FC, type MouseEvent } from 'react'

import { DateControlListItem } from './DateControlListItem'
import { type DateControlState } from './useDateControlState'

export interface DateControlListProps
  extends Omit<StackProps, 'onChange'>,
    Omit<DateControlState, 'dateAtom' | 'observerAtom'> {
  onChange?: (
    event: MouseEvent<HTMLDivElement>,
    values: Parameters<typeof set>[1]
  ) => void
}

export const DateControlList: FC<DateControlListProps> = ({
  solsticesAtom,
  culminationAtom,
  riseSetAtom,
  onChange,
  ...props
}) => {
  const { summer: summerSolstice, winter: winterSolstice } =
    useAtomValue(solsticesAtom)
  const culmination = useAtomValue(culminationAtom)
  const { rise: sunrise, set: sunset } = useAtomValue(riseSetAtom)

  const handleSummerSolsticeClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(event, {
        year: summerSolstice.getFullYear(),
        month: summerSolstice.getMonth(),
        date: summerSolstice.getDate()
      })
    },
    [summerSolstice, onChange]
  )

  const handleWinterSolsticeClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(event, {
        year: winterSolstice.getFullYear(),
        month: winterSolstice.getMonth(),
        date: winterSolstice.getDate()
      })
    },
    [winterSolstice, onChange]
  )

  const handleCulminationClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      onChange?.(event, {
        hours: culmination.getHours(),
        minutes: culmination.getMinutes(),
        seconds: culmination.getSeconds(),
        milliseconds: culmination.getMilliseconds()
      })
    },
    [culmination, onChange]
  )

  const handleSunriseClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (sunrise == null) {
        return
      }
      onChange?.(event, {
        hours: sunrise.getHours(),
        minutes: sunrise.getMinutes(),
        seconds: sunrise.getSeconds(),
        milliseconds: sunrise.getMilliseconds()
      })
    },
    [sunrise, onChange]
  )

  const handleSunsetClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (sunset == null) {
        return
      }
      onChange?.(event, {
        hours: sunset.getHours(),
        minutes: sunset.getMinutes(),
        seconds: sunset.getSeconds(),
        milliseconds: sunset.getMilliseconds()
      })
    },
    [sunset, onChange]
  )

  return (
    <Stack spacing={2} {...props}>
      <List dense disablePadding>
        <DateControlListItem
          label='夏至'
          value={format(summerSolstice, "M'月'd'日'")}
          onClick={handleSummerSolsticeClick}
        />
        <DateControlListItem
          label='冬至'
          value={format(winterSolstice, "M'月'd'日'")}
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
          value={sunrise != null ? format(sunrise, 'H:mm') : ''}
          disabled={sunrise == null}
          onClick={handleSunriseClick}
        />
        <DateControlListItem
          label='日の入'
          value={sunset != null ? format(sunset, 'H:mm') : ''}
          disabled={sunset == null}
          onClick={handleSunsetClick}
        />
      </List>
    </Stack>
  )
}
