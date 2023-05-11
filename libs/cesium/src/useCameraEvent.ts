import { type Camera, type Event } from '@cesium/engine'
import { useEffect, useRef } from 'react'

import { useCesium } from './useCesium'

export type CameraEventType = {
  [K in keyof Camera]: Camera[K] extends Event ? K : never
}[keyof Camera]

export type CameraEventListener<T extends CameraEventType = CameraEventType> = {
  moveStart: () => void
  moveEnd: () => void
  changed: (percentage: number) => void
}[T]

export function useCameraEvent<T extends CameraEventType>(
  type: T,
  callback: CameraEventListener<T>
): void {
  const camera = useCesium(({ camera }) => camera, { indirect: true })
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    return camera?.[type].addEventListener(event => {
      callbackRef.current(event)
    })
  }, [type, camera])
}
