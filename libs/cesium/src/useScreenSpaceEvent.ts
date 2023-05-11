import {
  type ScreenSpaceEventHandler,
  type ScreenSpaceEventType
} from '@cesium/engine'
import { useEffect, useRef } from 'react'

import { type ScreenSpaceEventCallback } from './ScreenSpaceEventCallback'

export function useScreenSpaceEvent<T extends ScreenSpaceEventType>(
  eventHandler: ScreenSpaceEventHandler,
  eventType: T,
  callback: ScreenSpaceEventCallback<T>
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  // Event handler can be destroyed outside of this hook.
  useEffect(() => {
    if (eventHandler.isDestroyed()) {
      return
    }
    // Event handler callback types don't intersect each other.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eventHandler.setInputAction((event: any) => {
      callbackRef.current(event)
    }, eventType)
    return () => {
      if (!eventHandler.isDestroyed()) {
        eventHandler.removeInputAction(eventType)
      }
    }
  }, [eventHandler, eventType])
}
