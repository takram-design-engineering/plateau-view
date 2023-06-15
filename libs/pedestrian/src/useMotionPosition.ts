import {
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
  type ValueAnimationTransition
} from 'framer-motion'
import { useEffect, useRef } from 'react'

import { type Position } from './types'

export function useMotionPosition(
  position: Position,
  options: ValueAnimationTransition<number> = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.3
  }
): MotionValue<Position> {
  const motionX = useMotionValue(position.x)
  const motionY = useMotionValue(position.y)
  const motionZ = useMotionValue(position.z)

  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    return animate(motionX, position.x, optionsRef.current).stop
  }, [position.x, motionX])
  useEffect(() => {
    return animate(motionY, position.y, optionsRef.current).stop
  }, [position.y, motionY])
  useEffect(() => {
    return animate(motionZ, position.z, optionsRef.current).stop
  }, [position.z, motionZ])

  return useTransform([motionX, motionY, motionZ], (values: number[]) => ({
    x: values[0],
    y: values[1],
    z: values[2]
  }))
}
