import { styled } from '@mui/material'
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

import { type HeadingPitch, type Location } from './types'
import { usePanoramaHeadingPitchChange } from './usePanoramaHeadingPitchChange'
import { usePanoramaLocationChange } from './usePanoramaLocationChange'
import { usePanoramaZoomChange } from './usePanoramaZoomChange'
import { useStreetView } from './useStreetView'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'hidden'
})<{ hidden?: boolean }>(({ hidden = false }) => ({
  ...(hidden && {
    visibility: 'hidden'
  })
}))

export interface StreetViewProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'onLoad' | 'onError'> {
  apiKey: string
  location: Location
  headingPitch?: HeadingPitch
  zoom?: number
  radius?: number
  onLoad?: (
    pano: string,
    location: Location,
    headingPitch: HeadingPitch,
    zoom: number
  ) => void
  onError?: (error: Error) => void
  onLocationChange?: (pano: string, location: Location) => void
  onHeadingPitchChange?: (headingPitch: HeadingPitch) => void
  onZoomChange?: (zoom: number) => void
}

export const StreetView = forwardRef<HTMLDivElement, StreetViewProps>(
  (
    {
      apiKey,
      location,
      headingPitch,
      zoom,
      radius = 100,
      onLoad,
      onError,
      onLocationChange,
      onHeadingPitchChange,
      onZoomChange,
      ...props
    },
    forwardedRef
  ) => {
    const { container, panorama, service } = useStreetView(apiKey)

    const ref = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
      const element = ref.current
      invariant(element != null)

      // TODO: Prevent street view container from being appended to multiple
      // elements at the same time.
      element.appendChild(container)
      return () => {
        invariant(container != null)
        element.removeChild(container)
      }
    }, [container])

    // Street View's Panorama is reused across different pedestrian layers, and
    // fires events for the previous layer before the current layer sets the
    // initial location. Ignore any events until this flag becomes true.
    const panoSetRef = useRef(false)

    const headingPitchRef = useRef(headingPitch)
    const zoomRef = useRef(zoom)
    headingPitchRef.current = headingPitch
    zoomRef.current = zoom

    const [hasError, setHasError] = useState(false)
    const onErrorRef = useRef(onError)
    onErrorRef.current = onError

    useEffect(() => {
      let canceled = false
      ;(async () => {
        const { data } = await service.getPanorama({
          location: {
            lng: location.longitude,
            lat: location.latitude
          },
          radius,
          source: google.maps.StreetViewSource.OUTDOOR
        })
        if (canceled) {
          return
        }
        if (data.location == null) {
          return
        }
        panorama.setPano(data.location.pano)
        if (headingPitchRef.current != null) {
          panorama.setPov(headingPitchRef.current)
        }
        if (zoomRef.current != null) {
          panorama.setZoom(zoomRef.current)
        }
        panoSetRef.current = true
        setHasError(false)
      })().catch(error => {
        setHasError(true)
        onErrorRef.current?.(error)
      })
      return () => {
        canceled = true
      }
    }, [location, radius, panorama, service])

    // I'm going to invoke onLoad or onError callbacks at the first time
    // location changes after it's set. This keeps track of that state.
    const locationChangedRef = useRef(false)

    usePanoramaLocationChange(panorama, location => {
      if (!panoSetRef.current) {
        return
      }
      if (!locationChangedRef.current) {
        invariant(location != null)
        onLoad?.(
          panorama.getPano(),
          location,
          panorama.getPov(),
          panorama.getZoom()
        )
        locationChangedRef.current = true
      } else {
        invariant(location != null)
        onLocationChange?.(panorama.getPano(), location)
      }
    })
    usePanoramaHeadingPitchChange(panorama, headingPitch => {
      if (!panoSetRef.current) {
        return
      }
      onHeadingPitchChange?.(headingPitch)
    })
    usePanoramaZoomChange(panorama, zoom => {
      if (!panoSetRef.current) {
        return
      }
      onZoomChange?.(zoom)
    })

    return (
      <Root ref={mergeRefs([ref, forwardedRef])} {...props} hidden={hasError} />
    )
  }
)
