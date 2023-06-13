import { Loader } from '@googlemaps/js-api-loader'
import { useMemo, useRef } from 'react'
import { suspend } from 'suspend-react'

export interface StreetViewPanorama {
  container: HTMLDivElement
  panorama: google.maps.StreetViewPanorama
  service: google.maps.StreetViewService
}

export function useStreetView(
  apiKey: string,
  options: google.maps.StreetViewPanoramaOptions = {
    zoomControl: false,
    panControl: false,
    addressControl: false,
    fullscreenControl: false,
    imageDateControl: false,
    motionTrackingControl: false
  }
): StreetViewPanorama {
  const library = suspend(async () => {
    const loader = new Loader({
      apiKey,
      version: 'weekly'
    })
    return await loader.importLibrary('streetView')
  }, [useStreetView, apiKey])

  const optionsRef = useRef(options)
  optionsRef.current = options

  return useMemo(() => {
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    return {
      container,
      panorama: new library.StreetViewPanorama(container, optionsRef.current),
      service: new library.StreetViewService()
    }
  }, [library])
}
