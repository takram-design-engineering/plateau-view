import { useEffect, useRef } from 'react'

export type PanoramaChangeHook<T> = (
  panorama: google.maps.StreetViewPanorama,
  callback?: (value: T) => void
) => void

export interface PanoramaChangeHookOptions<T, U> {
  eventType: string
  getter: (panorama: google.maps.StreetViewPanorama) => T
  transform: (value: T) => U
  compare: (prevValue: T, nextValue: T) => boolean
}

export function createPanoramaChangeHook<T, U>({
  eventType,
  getter,
  transform,
  compare
}: PanoramaChangeHookOptions<T, U>): PanoramaChangeHook<U> {
  return (panorama, callback) => {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
      if (panorama == null) {
        return
      }
      let prevValue = getter(panorama)
      const handleChange = (): void => {
        const nextValue = getter(panorama)
        if (compare(prevValue, nextValue)) {
          return
        }
        prevValue = nextValue
        callbackRef.current?.(transform(prevValue))
      }

      callbackRef.current?.(transform(prevValue))

      const listener = panorama.addListener(eventType, handleChange)
      return () => {
        listener.remove()
      }
    }, [panorama])
  }
}
