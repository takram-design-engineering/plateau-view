import { createPanoramaChangeHook } from './createPanoramaChangeHook'
import { type Location } from './types'

export const usePanoramaLocationChange = createPanoramaChangeHook({
  eventType: 'position_changed',
  getter: panorama => panorama.getPosition(),
  transform: (value): Location | null =>
    value != null
      ? {
          longitude: value.lng(),
          latitude: value.lat(),
          // https://google.fandom.com/wiki/Google_Street_View#:~:text=On%20each%20of%20these%20vehicles,the%20front%20of%20the%20vehicle.
          height: 2.5
        }
      : null,
  compare: (prevValue, nextValue) => prevValue?.equals(nextValue) === true
})
