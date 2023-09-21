import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  JulianDate
} from '@cesium/engine'
import { styled } from '@mui/material'
import { startOfMinute } from 'date-fns'
import { useCallback, useLayoutEffect, useState, type FC } from 'react'

import { useCameraEvent, useCesium, useClockTick } from '@takram/plateau-cesium'
import { getCameraEllipsoidIntersection } from '@takram/plateau-cesium-helpers'
import { DateControl, FloatingPanel } from '@takram/plateau-ui-components'

const cartesianScratch = new Cartesian3()
const cartographicScratch = new Cartographic()

const Root = styled(FloatingPanel)(({ theme }) => ({
  width: 640,
  [theme.breakpoints.down('sm')]: {
    width: `calc(100vw - ${theme.spacing(2)})`
  }
}))

export const DateControlPanel: FC = () => {
  const clock = useCesium(({ clock }) => clock, { indirect: true })
  const scene = useCesium(({ scene }) => scene, { indirect: true })

  const [date, setDate] = useState<Date>()
  const [coords, setCoords] = useState<{
    longitude: number
    latitude: number
  }>()

  const handleClockChange = useCallback(() => {
    if (clock == null) {
      return
    }
    setDate(prevValue => {
      const nextValue = startOfMinute(JulianDate.toDate(clock.currentTime))
      return prevValue == null || +nextValue !== +prevValue
        ? nextValue
        : prevValue
    })
  }, [clock])

  useClockTick(handleClockChange)

  const handleCameraChange = useCallback(() => {
    if (scene == null) {
      return
    }
    try {
      getCameraEllipsoidIntersection(scene, cartesianScratch)
      const ellipsoid = scene.globe.ellipsoid
      const cartographic = Cartographic.fromCartesian(
        cartesianScratch,
        ellipsoid,
        cartographicScratch
      )
      if (cartographic == null) {
        return
      }
      setCoords({
        longitude: CesiumMath.toDegrees(cartographic.longitude),
        latitude: CesiumMath.toDegrees(cartographic.latitude)
      })
    } catch (error) {
      console.error(error)
    }
  }, [scene])

  useCameraEvent('changed', handleCameraChange)

  useLayoutEffect(() => {
    handleClockChange()
    handleCameraChange()
  }, [handleClockChange, handleCameraChange])

  const handleChange = useCallback(
    (event: unknown, date: Date) => {
      if (clock == null) {
        return
      }
      setDate(date)
      JulianDate.fromDate(date, clock.currentTime)
    },
    [clock]
  )

  if (date == null || coords == null) {
    return null
  }
  return (
    <Root>
      <DateControl date={date} {...coords} onChange={handleChange} />
    </Root>
  )
}
