import { Loader } from '@googlemaps/js-api-loader'
import { atom, useSetAtom } from 'jotai'
import { suspend } from 'suspend-react'

export interface StreetView {
  container: HTMLDivElement
  panorama: google.maps.StreetViewPanorama
  service: google.maps.StreetViewService
}

const streetViewPrimitiveAtom = atom<StreetView | null>(null)
export const streetViewAtom = atom(get => get(streetViewPrimitiveAtom))

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
  const setStreetView = useSetAtom(streetViewPrimitiveAtom)

  return suspend(async () => {
    const loader = new Loader({
      apiKey,
      version: '3.53' // As of May 2023
    })
    const library = await loader.importLibrary('streetView')
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'

    const streetView = {
      container,
      panorama: new library.StreetViewPanorama(container, options),
      service: new library.StreetViewService()
    }
    setStreetView(streetView)
    return streetView
  }, [apiKey])
}
