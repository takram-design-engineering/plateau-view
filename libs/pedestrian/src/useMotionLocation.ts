import {
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type ValueAnimationTransition
} from 'framer-motion'
import { useEffect, useRef } from 'react'

import { type Location } from './types'

export function useMotionLocation(
  location: Location,
  options: ValueAnimationTransition<number> = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.2
  }
): MotionValue<Required<Location>> {
  const motionLongitude = useMotionValue(location.longitude)
  const motionLatitude = useMotionValue(location.latitude)
  const motionHeight = useMotionValue(location.height ?? 0)

  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    return animate(motionLongitude, location.longitude, optionsRef.current).stop
  }, [location.longitude, motionLongitude])
  useEffect(() => {
    return animate(motionLatitude, location.latitude, optionsRef.current).stop
  }, [location.latitude, motionLatitude])
  useEffect(() => {
    return animate(motionHeight, location.height ?? 0, optionsRef.current).stop
  }, [location.height, motionHeight])

  return useTransform(
    [motionLongitude, motionLatitude, motionHeight],
    (values: number[]) => ({
      longitude: values[0],
      latitude: values[1],
      height: values[2]
    })
  )
}
