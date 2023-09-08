import {
  Box,
  IconButton,
  Popover,
  Stack,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { endOfYear, format, set, startOfDay, startOfYear } from 'date-fns'
import { omit } from 'lodash'
import {
  bindPopover,
  bindTrigger,
  usePopupState
} from 'material-ui-popup-state/hooks'
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type MouseEvent,
  type SyntheticEvent
} from 'react'
import invariant from 'tiny-invariant'

import { DateControlList } from './DateControlList'
import { DateControlSliderGraph } from './DateControlSliderGraph'
import { DateSlider } from './DateSlider'
import { ListIcon } from './icons'
import {
  useDateControlState,
  type DateControlStateParams
} from './useDateControlState'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  paddingRight: theme.spacing(6),
  paddingBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(3)
  }
}))

const DateText = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  fontVariantNumeric: 'tabular-nums'
}))

const TimeText = styled('div')(({ theme }) => ({
  ...theme.typography.h4,
  fontVariantNumeric: 'tabular-nums'
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(-1)
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

    const handleListChange = useCallback(
      (
        event: MouseEvent<HTMLDivElement>,
        values: Parameters<typeof set>[1]
      ) => {
        onChange?.(event, set(dateRef.current, values))
      },
      [onChange]
    )

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

    const id = useId()
    const popupState = usePopupState({
      variant: 'popover',
      popupId: id
    })

    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))
    return (
      <Root ref={ref} {...props}>
        <Stack
          width='100%'
          {...(smDown
            ? { direction: 'column', spacing: 1 }
            : { direction: 'row', spacing: 3 })}
        >
          <Stack
            {...(smDown
              ? { direction: 'row', justifyContent: 'space-between' }
              : { direction: 'column', spacing: 2, width: 200 })}
          >
            <Stack
              {...(smDown
                ? { direction: 'row', spacing: 2, alignItems: 'center' }
                : { direction: 'column', spacing: 0.5 })}
            >
              <DateText>{format(date, "yyyy'年'M'月'd'日'")}</DateText>
              <TimeText>{format(date, 'H:mm')}</TimeText>
            </Stack>
            {!smDown ? (
              <DateControlList
                {...omit(state, ['dateAtom', 'observerAtom'])}
                onChange={handleListChange}
              />
            ) : (
              <>
                <StyledIconButton {...bindTrigger(popupState)}>
                  <ListIcon fontSize='medium' />
                </StyledIconButton>
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
                >
                  <Box width={200} padding={2}>
                    <DateControlList
                      {...omit(state, ['dateAtom', 'observerAtom'])}
                      onChange={handleListChange}
                    />
                  </Box>
                </Popover>
              </>
            )}
          </Stack>
          <Stack width='100%' spacing={2}>
            <div>
              <DateSlider
                min={+startOfYear(date)}
                max={+startOfDay(endOfYear(date))}
                value={+startOfDay(date)}
                onChange={handleSliderChange}
              />
            </div>
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
