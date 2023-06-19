import { atom } from 'jotai'

import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { PEDESTRIAN_OBJECT } from './Pedestrian'

export const pedestrianSelectionAtom = atom(get => {
  return get(screenSpaceSelectionAtom).filter(
    (entry): entry is ScreenSpaceSelectionEntry<typeof PEDESTRIAN_OBJECT> =>
      entry.type === PEDESTRIAN_OBJECT
  )
})
