import { createPanoramaChangeHook } from './createPanoramaChangeHook'
import { type HeadingPitch } from './types'

export const usePanoramaHeadingPitchChange = createPanoramaChangeHook({
  eventType: 'pov_changed',
  getter: panorama => panorama.getPov(),
  transform: (value): HeadingPitch => ({
    heading: value.heading,
    pitch: value.pitch
  }),
  compare: (prevValue, nextValue) =>
    prevValue.heading === nextValue.heading &&
    prevValue.pitch === nextValue.pitch
})
