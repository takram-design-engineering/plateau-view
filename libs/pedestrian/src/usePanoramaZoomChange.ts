import { useEffect, useRef } from 'react'

export function usePanoramaZoomChange(
  panorama?: google.maps.StreetViewPanorama,
  callback?: (zoom: number) => void
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (panorama == null) {
      return
    }
    let prevValue = panorama.getZoom()
    const handleChange = (): void => {
      const nextValue = panorama.getZoom()
      if (nextValue === prevValue) {
        return
      }
      prevValue = nextValue
      callbackRef.current?.(nextValue)
    }

    callbackRef.current?.(prevValue)

    const listener = panorama.addListener('zoom_changed', handleChange)
    return () => {
      listener.remove()
    }
  }, [panorama])
}
