import { alpha, Slider, sliderClasses, styled } from '@mui/material'
import { endOfDay, startOfDay, startOfMinute } from 'date-fns'
import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  DateControlGraph,
  type DateControlGraphProps
} from './DateControlGraph'

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  borderRadius: theme.shape.borderRadius / 2,
  // Match the light style of divider.
  // https://github.com/mui/material-ui/blob/v5.13.1/packages/mui-material/src/Divider/Divider.js#L71
  boxShadow: `inset 0 0 0 1px ${alpha(theme.palette.divider, 0.08)}`
}))

const StyledSlider = styled(Slider)(({ theme }) => {
  const borderRadius = 5
  return {
    position: 'absolute',
    inset: 0,
    right: borderRadius,
    left: borderRadius,
    width: 'auto',
    height: 'auto',
    borderRadius: 0,
    [`& .${sliderClasses.thumb}`]: {
      width: 1,
      height: '100%',
      color: theme.palette.primary.main,
      borderRadius: 1,
      boxShadow: 'none',
      '&:before': {
        display: 'none'
      },
      [`&:hover, &.${sliderClasses.focusVisible}`]: {
        boxShadow: 'none'
      },
      [`&.${sliderClasses.active}, &.${sliderClasses.focusVisible}`]: {
        boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.08)}`
      },
      [`&.${sliderClasses.disabled}`]: {
        '&:hover': {
          boxShadow: 'none'
        }
      }
    },
    [`& .${sliderClasses.rail}`]: {
      display: 'none'
    },
    [`& .${sliderClasses.track}`]: {
      display: 'none'
    }
  }
})

const StyledDateControlGraph = styled(DateControlGraph)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none'
})

export interface DateControlSliderGraphProps
  extends Omit<DateControlGraphProps, 'onChange'> {
  onChange?: (event: Event, value: number | number[]) => void
}

export const DateControlSliderGraph: FC<DateControlSliderGraphProps> = ({
  dateAtom,
  onChange,
  ...props
}) => {
  const date = useAtomValue(dateAtom)
  return (
    <Root>
      <StyledSlider
        min={+startOfDay(date)}
        max={+startOfMinute(endOfDay(date))}
        value={+date}
        onChange={onChange}
      />
      <StyledDateControlGraph {...props} dateAtom={dateAtom} />
    </Root>
  )
}
