import { Loader } from '@googlemaps/js-api-loader'
import { suspend } from 'suspend-react'

export interface StreetView {
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
): StreetView {
  return suspend(async () => {
    const loader = new Loader({
      apiKey,
      version: 'weekly'
    })
    const library = await loader.importLibrary('streetView')
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'

    return {
      container,
      panorama: new library.StreetViewPanorama(container, options),
      service: new library.StreetViewService()
    }
  }, [apiKey])
}
