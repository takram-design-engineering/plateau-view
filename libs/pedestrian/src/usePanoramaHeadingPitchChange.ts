import { useEffect, useRef } from 'react'

import { type HeadingPitch } from './types'

export function usePanoramaHeadingPitchChange(
  panorama?: google.maps.StreetViewPanorama,
  callback?: (headingPitch?: HeadingPitch) => void
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (panorama == null) {
      return
    }
    let prevValue = panorama.getPov()
    const handleChange = (): void => {
      const nextValue = panorama.getPov()
      if (
        nextValue?.heading === prevValue.heading &&
        nextValue?.pitch === prevValue.pitch
      ) {
        return
      }
      prevValue = nextValue
      callbackRef.current?.(
        prevValue != null
          ? {
              heading: prevValue.heading,
              pitch: prevValue.pitch
            }
          : undefined
      )
    }

    callbackRef.current?.(
      prevValue != null
        ? {
            heading: prevValue.heading,
            pitch: prevValue.pitch
          }
        : undefined
    )

    const listener = panorama.addListener('pov_changed', handleChange)
    return () => {
      listener.remove()
    }
  }, [panorama])
}
