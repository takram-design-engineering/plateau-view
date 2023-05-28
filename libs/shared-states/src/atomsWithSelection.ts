import { atom } from 'jotai'
import { differenceWith, intersectionWith, without } from 'lodash'

import { isNotNullish } from '@takram/plateau-type-helpers'

export interface SelectionAtomsOptions<T, U = T> {
  transform?: (object: U) => T | null | undefined
  isEqual?: (a: T, b: T) => boolean
  onSelect?: (value: T) => void
  onDeselect?: (value: T) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function atomsWithSelection<T, U = T>({
  transform = object => object as unknown as T,
  isEqual = (a, b) => a === b,
  onSelect,
  onDeselect
}: SelectionAtomsOptions<T, U> = {}) {
  const selectionPrimitiveAtom = atom<T[]>([])

  const selectionAtom = atom(
    get => get(selectionPrimitiveAtom),
    (get, set, objects: readonly U[]) => {
      set(selectionPrimitiveAtom, prevSelection => {
        if (objects.length === 0) {
          if (prevSelection.length > 0 && onDeselect != null) {
            prevSelection.forEach(onDeselect)
          }
          return []
        }
        // Assume that the cost of deriving difference here is smaller than
        // triggering state update.
        const values = objects.map(transform).filter(isNotNullish)
        const valuesToRemove = differenceWith(prevSelection, values, isEqual)
        const valuesToAdd = differenceWith(values, prevSelection, isEqual)
        if (valuesToRemove.length > 0 && onDeselect != null) {
          valuesToRemove.forEach(onDeselect)
        }
        if (valuesToAdd.length > 0 && onSelect != null) {
          valuesToAdd.forEach(onSelect)
        }
        return valuesToRemove.length > 0 || valuesToAdd.length > 0
          ? [...without(prevSelection, ...valuesToRemove), ...valuesToAdd]
          : prevSelection
      })
    }
  )

  const addAtom = atom(null, (get, set, objects: readonly U[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const values = objects.map(transform).filter(isNotNullish)
      const valuesToAdd = differenceWith(values, prevSelection, isEqual)
      if (valuesToAdd.length === 0) {
        return prevSelection
      }
      if (onSelect != null) {
        valuesToAdd.forEach(onSelect)
      }
      return [...prevSelection, ...valuesToAdd]
    })
  })

  const removeAtom = atom(null, (get, set, objects: readonly U[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const values = objects.map(transform).filter(isNotNullish)
      const valuesToRemove = intersectionWith(prevSelection, values, isEqual)
      if (valuesToRemove.length === 0) {
        return prevSelection
      }
      if (onDeselect != null) {
        valuesToRemove.forEach(onDeselect)
      }
      return without(prevSelection, ...valuesToRemove)
    })
  })

  const clearAtom = atom(null, (get, set) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (prevSelection.length === 0) {
        return prevSelection
      }
      if (onDeselect != null) {
        prevSelection.forEach(onDeselect)
      }
      return []
    })
  })

  return {
    selectionAtom,
    addAtom,
    removeAtom,
    clearAtom
  }
}

export type SelectionAtoms = ReturnType<typeof atomsWithSelection>
