import { styled } from '@mui/material'
import {
  forwardRef,
  useEffect,
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

export interface StreetViewProps extends ComponentPropsWithRef<typeof Root> {
  apiKey: string
  location: Location
  radius?: number
  onLocationChange?: (location: Location | null) => void
  onHeadingPitchChange?: (headingPitch: HeadingPitch) => void
  onZoomChange?: (zoom: number) => void
}

export const StreetView = forwardRef<HTMLDivElement, StreetViewProps>(
  (
    {
      apiKey,
      location,
      radius = 1000,
      onLocationChange,
      onHeadingPitchChange,
      onZoomChange,
      ...props
    },
    forwardedRef
  ) => {
    const { container, panorama, service } = useStreetView(apiKey)

    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
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

    const callbackRefs = useRef({
      onLocationChange,
      onHeadingPitchChange,
      onZoomChange
    })
    Object.assign(callbackRefs.current, {
      onLocationChange,
      onHeadingPitchChange,
      onZoomChange
    })

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
        }
      })().catch(error => {
        console.error(error)
      })
      return () => {
        canceled = true
      }
    }, [location, radius, panorama, service])

    usePanoramaLocationChange(panorama, onLocationChange)
    usePanoramaHeadingPitchChange(panorama, onHeadingPitchChange)
    usePanoramaZoomChange(panorama, onZoomChange)

    return <Root ref={mergeRefs([ref, forwardedRef])} {...props} />
  }
)
