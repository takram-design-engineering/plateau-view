import { useEffect, useRef } from 'react'

import { type Location } from './types'

const defaultHeight = 2

export function usePanoramaLocationChange(
  panorama?: google.maps.StreetViewPanorama,
  callback?: (location?: Location) => void
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (panorama == null) {
      return
    }
    let prevValue = panorama.getPosition()
    const handleChange = (): void => {
      const nextValue = panorama.getPosition()
      if (nextValue?.equals(prevValue) === true) {
        return
      }
      prevValue = nextValue
      callbackRef.current?.(
        prevValue != null
          ? {
              longitude: prevValue.lng(),
              latitude: prevValue.lat(),
              height: defaultHeight
            }
          : undefined
      )
    }

    callbackRef.current?.(
      prevValue != null
        ? {
            longitude: prevValue.lng(),
            latitude: prevValue.lat(),
            height: defaultHeight
          }
        : undefined
    )

    const listener = panorama.addListener('position_changed', handleChange)
    return () => {
      listener.remove()
    }
  }, [panorama])
}
