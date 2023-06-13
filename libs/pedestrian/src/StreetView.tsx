import { Loader } from '@googlemaps/js-api-loader'
import { styled } from '@mui/material'
import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type FC
} from 'react'
import { suspend } from 'suspend-react'
import invariant from 'tiny-invariant'

import { type HeadingPitch, type Location } from './types'
import { usePanoramaHeadingPitchChange } from './usePanoramaHeadingPitchChange'
import { usePanoramaLocationChange } from './usePanoramaLocationChange'
import { usePanoramaZoomChange } from './usePanoramaZoomChange'

let container: HTMLDivElement | undefined
let panorama: google.maps.StreetViewPanorama | undefined
let service: google.maps.StreetViewService | undefined

const Root = styled('div')({})

export interface StreetViewProps extends ComponentPropsWithoutRef<typeof Root> {
  apiKey: string
  location: Location
  radius?: number
  onLocationChange?: (location?: Location) => void
  onHeadingPitchChange?: (headingPitch?: HeadingPitch) => void
  onZoomChange?: (zoom?: number) => void
}

export const StreetView: FC<StreetViewProps> = ({
  apiKey,
  location,
  radius = 1000,
  onLocationChange,
  onHeadingPitchChange,
  onZoomChange,
  ...props
}) => {
  const { StreetViewPanorama, StreetViewService } = suspend(async () => {
    const loader = new Loader({
      apiKey,
      version: 'weekly'
    })
    return await loader.importLibrary('streetView')
  }, [StreetView])

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container == null || panorama == null) {
      invariant(container == null && panorama == null)
      container = document.createElement('div')
      container.style.width = '100%'
      container.style.height = '100%'
      panorama = new StreetViewPanorama(container, {
        zoomControl: false,
        panControl: false,
        addressControl: false,
        fullscreenControl: false,
        imageDateControl: false,
        motionTrackingControl: false
      })
    }
    const element = ref.current
    invariant(element != null)
    element.appendChild(container)
    return () => {
      invariant(container != null)
      element.removeChild(container)
    }
  }, [StreetViewPanorama])

  // Load street view panorama.
  useEffect(() => {
    if (panorama == null) {
      return
    }
    if (service == null) {
      service = new StreetViewService()
    }
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
  }, [location, radius, StreetViewService])

  usePanoramaLocationChange(panorama, onLocationChange)
  usePanoramaHeadingPitchChange(panorama, onHeadingPitchChange)
  usePanoramaZoomChange(panorama, onZoomChange)

  return <Root ref={ref} {...props} />
}
