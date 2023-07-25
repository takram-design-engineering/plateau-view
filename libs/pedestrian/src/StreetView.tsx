import { styled } from '@mui/material'
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithRef
} from 'react'
import { mergeRefs } from 'react-merge-refs'
import invariant from 'tiny-invariant'

import { type HeadingPitch, type Location } from './types'
import { usePanoramaHeadingPitchChange } from './usePanoramaHeadingPitchChange'
import { usePanoramaLocationChange } from './usePanoramaLocationChange'
import { usePanoramaZoomChange } from './usePanoramaZoomChange'
import { useStreetView } from './useStreetView'

const Root = styled('div')({})

export interface StreetViewProps
  extends Omit<ComponentPropsWithRef<typeof Root>, 'onLoad'> {
  apiKey: string
  location: Location
  headingPitch?: HeadingPitch
  zoom?: number
  radius?: number
  onLoad?: (
    location: Location,
    headingPitch: HeadingPitch,
    zoom: number
  ) => void
  onNotFound?: () => void
  onLocationChange?: (location: Location) => void
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
      onNotFound,
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
        if (data.location != null) {
          panorama.setPano(data.location.pano)
          panoSetRef.current = true
        }
      })().catch(error => {
        console.error(error)
      })
      return () => {
        canceled = true
      }
    }, [location, radius, panorama, service])

    // I'm going to invoke onLoad or onNotFound callbacks at the first time
    // location changes after it's set. This keeps track of that state.
    const locationChangedRef = useRef(false)

    usePanoramaLocationChange(panorama, location => {
      if (!panoSetRef.current) {
        return
      }
      if (!locationChangedRef.current) {
        if (location != null) {
          onLoad?.(location, panorama.getPov(), panorama.getZoom())
          locationChangedRef.current = true
        } else {
          onNotFound?.()
        }
      } else {
        invariant(location != null)
        onLocationChange?.(location)
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

    return <Root ref={mergeRefs([ref, forwardedRef])} {...props} />
  }
)
