import { JulianDate } from '@cesium/engine'
import { set } from 'date-fns'
import { memo, useEffect, type FC } from 'react'

import { useCesium } from './useCesium'

export interface CurrentTimeProps {
  currentTime?: JulianDate | Date
  year?: number
  month?: number
  date?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export const CurrentTime: FC<CurrentTimeProps> = memo(
  ({ currentTime, ...props }) => {
    const date = +set(
      (currentTime instanceof JulianDate
        ? JulianDate.toDate(currentTime)
        : currentTime) ?? new Date(),
      props
    )

    const clock = useCesium(({ clock }) => clock)
    const scene = useCesium(({ scene }) => scene)

    useEffect(() => {
      JulianDate.fromDate(new Date(date), clock.currentTime)
      scene.requestRender()
    }, [date, clock, scene])

    return null
  }
)
