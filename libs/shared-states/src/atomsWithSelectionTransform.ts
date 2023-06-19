import { atom } from 'jotai'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { type SelectionAtoms } from './atomsWithSelection'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function atomsWithSelectionTransform<T, U = T>(
  selectionAtoms: SelectionAtoms<T>,
  transform: (object: U) => T | null | undefined
) {
  const replaceAtom = atom(
    get => null,
    (get, set, objects: readonly U[]) => {
      set(
        selectionAtoms.selectionAtom,
        objects.map(transform).filter(isNotNullish)
      )
    }
  )

  const addAtom = atom(null, (get, set, objects: readonly U[]) => {
    set(selectionAtoms.addAtom, objects.map(transform).filter(isNotNullish))
  })

  const removeAtom = atom(null, (get, set, objects: readonly U[]) => {
    set(selectionAtoms.removeAtom, objects.map(transform).filter(isNotNullish))
  })

  return {
    replaceAtom,
    addAtom,
    removeAtom
  }
}
