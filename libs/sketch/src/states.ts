import { atom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'

import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { createSketchMachine } from './sketchMachine'
import { SKETCH_OBJECT } from './types'

export const sketchMachineAtom = atomWithMachine(get => createSketchMachine())

export const sketchSelectionAtom = atom(get => {
  return get(screenSpaceSelectionAtom).filter(
    (entry): entry is ScreenSpaceSelectionEntry<typeof SKETCH_OBJECT> =>
      entry.type === SKETCH_OBJECT
  )
})
