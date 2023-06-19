import { createPanoramaChangeHook } from './createPanoramaChangeHook'

export const usePanoramaZoomChange = createPanoramaChangeHook({
  eventType: 'zoom_changed',
  getter: panorama => panorama.getZoom(),
  transform: value => value,
  compare: (prevValue, nextValue) => prevValue === nextValue
})
