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

let container: HTMLDivElement
let panorama: google.maps.StreetViewPanorama
let service: google.maps.StreetViewService

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

  const handlerRefs = useRef({
    onLocationChange,
    onHeadingPitchChange,
    onZoomChange
  })
  Object.assign(handlerRefs.current, {
    onLocationChange,
    onHeadingPitchChange,
    onZoomChange
  })

  useEffect(() => {
    const { onLocationChange, onHeadingPitchChange, onZoomChange } =
      handlerRefs.current

    let prevPosition = panorama.getPosition()
    const handlePositionChange = (): void => {
      const nextPosition = panorama.getPosition()
      if (nextPosition?.equals(prevPosition) === true) {
        return
      }
      prevPosition = nextPosition
      onLocationChange?.(
        prevPosition != null
          ? {
              longitude: prevPosition.lng(),
              latitude: prevPosition.lat(),
              height: 2 // TODO: Make this configurable
            }
          : undefined
      )
    }

    let prevPov = panorama.getPov()
    const handlePovChange = (): void => {
      const nextPov = panorama.getPov()
      if (
        nextPov?.heading === prevPov.heading &&
        nextPov?.pitch === prevPov.pitch
      ) {
        return
      }
      prevPov = nextPov
      onHeadingPitchChange?.(
        prevPov != null
          ? {
              heading: prevPov.heading,
              pitch: prevPov.pitch
            }
          : undefined
      )
    }

    let prevZoom = panorama.getZoom()
    const handleZoomChange = (): void => {
      const nextZoom = panorama.getZoom()
      if (nextZoom === prevZoom) {
        return
      }
      prevZoom = nextZoom
      onZoomChange?.(nextZoom)
    }

    onLocationChange?.(
      prevPosition != null
        ? {
            longitude: prevPosition.lng(),
            latitude: prevPosition.lat(),
            height: 2 // TODO: Make this configurable
          }
        : undefined
    )
    onHeadingPitchChange?.(
      prevPov != null
        ? {
            heading: prevPov.heading,
            pitch: prevPov.pitch
          }
        : undefined
    )
    onZoomChange?.(prevZoom)

    const positionChangeListener = panorama.addListener(
      'position_changed',
      handlePositionChange
    )
    const povChangeListener = panorama.addListener(
      'pov_changed',
      handlePovChange
    )
    const zoomChangeListener = panorama.addListener(
      'zoom_changed',
      handleZoomChange
    )
    return () => {
      positionChangeListener.remove()
      povChangeListener.remove()
      zoomChangeListener.remove()
    }
  }, [])

  return <Root ref={ref} {...props} />
}
