import { type Clock, type Event } from '@cesium/engine'
import { useEffect, useRef } from 'react'

import { useCesium } from './useCesium'

export type ClockEventType = {
  [K in keyof Clock]: Clock[K] extends Event ? K : never
}[keyof Clock]

export type ClockEventListener = (clock: Clock) => void

export function useClockEvent(
  type: ClockEventType,
  callback: ClockEventListener
): void {
  const clock = useCesium(({ clock }) => clock, { indirect: true })
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    return clock?.[type].addEventListener((clock: Clock) => {
      callbackRef.current(clock)
    })
  }, [type, clock])
}

export function useClockTick(callback: ClockEventListener): void {
  useClockEvent('onTick', callback)
}

export function useClockStop(callback: ClockEventListener): void {
  useClockEvent('onStop', callback)
}
