import { atom } from 'jotai'

import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { PEDESTRIAN_ENTITY } from './Pedestrian'

export const pedestrianSelectionAtom = atom(get => {
  return get(screenSpaceSelectionAtom).filter(
    (entry): entry is ScreenSpaceSelectionEntry<typeof PEDESTRIAN_ENTITY> =>
      entry.type === PEDESTRIAN_ENTITY
  )
})
