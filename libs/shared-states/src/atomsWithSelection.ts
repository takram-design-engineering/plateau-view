import { atom, type SetStateAction } from 'jotai'
import { differenceBy, intersectionBy, without } from 'lodash'

export interface SelectionAtomsOptions<T> {
  getKey?: (a: T) => unknown
  onSelect?: (value: T) => void
  onDeselect?: (value: T) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function atomsWithSelection<T>({
  getKey = value => value,
  onSelect,
  onDeselect
}: SelectionAtomsOptions<T> = {}) {
  const selectionPrimitiveAtom = atom<T[]>([])

  const selectionAtom = atom(
    get => get(selectionPrimitiveAtom),
    (get, set, action: SetStateAction<readonly T[]>) => {
      set(selectionPrimitiveAtom, prevSelection => {
        const values =
          typeof action === 'function' ? action(prevSelection) : action
        if (values.length === 0) {
          if (prevSelection.length === 0) {
            return prevSelection
          }
          if (prevSelection.length > 0 && onDeselect != null) {
            prevSelection.forEach(onDeselect)
          }
          return []
        }
        // Assume that the cost of deriving difference here is smaller than
        // triggering state update.
        // Note that differenceBy is much faster than differenceWith because it
        // can internally use Set. Same is for intersectionBy.
        const valuesToRemove = differenceBy(prevSelection, values, getKey)
        const valuesToAdd = differenceBy(values, prevSelection, getKey)
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

  const addAtom = atom(null, (get, set, values: readonly T[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (values.length === 0) {
        return prevSelection
      }
      const valuesToAdd = differenceBy(values, prevSelection, getKey)
      if (valuesToAdd.length === 0) {
        return prevSelection
      }
      if (onSelect != null) {
        valuesToAdd.forEach(onSelect)
      }
      return [...prevSelection, ...valuesToAdd]
    })
  })

  const removeAtom = atom(null, (get, set, values: readonly T[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (values.length === 0) {
        return prevSelection
      }
      const valuesToRemove = intersectionBy(prevSelection, values, getKey)
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

export type SelectionAtoms<T> = ReturnType<typeof atomsWithSelection<T>>
