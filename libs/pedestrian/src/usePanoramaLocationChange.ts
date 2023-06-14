import { createPanoramaChangeHook } from './createPanoramaChangeHook'
import { type Location } from './types'

export const usePanoramaLocationChange = createPanoramaChangeHook({
  eventType: 'position_changed',
  getter: panorama => panorama.getPosition(),
  transform: (value): Location => ({
    longitude: value.lng(),
    latitude: value.lat(),
    height: 2
  }),
  compare: (prevValue, nextValue) => prevValue?.equals(nextValue) === true
})
