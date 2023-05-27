import { atom, type Getter, type SetStateAction, type Setter } from 'jotai'
import { difference, intersection, without } from 'lodash'

export interface SelectionAtomsOptions<T> {
  onSelect?: (objects: readonly T[]) => readonly T[]
  onDeselect?: (objects: readonly T[]) => readonly T[]
  onUpdate?: (get: Getter, set: Setter, objects: readonly T[]) => void
}

export type SelectionAtoms = ReturnType<typeof atomsWithSelection>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function atomsWithSelection<T>({
  onSelect = objects => objects,
  onDeselect = objects => objects,
  onUpdate
}: SelectionAtomsOptions<T> = {}) {
  const selectionPrimitiveAtom = atom<T[]>([])

  const updateSelectionAtom = atom(
    null,
    (get, set, value: SetStateAction<T[]>) => {
      set(selectionPrimitiveAtom, prevValue => {
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        onUpdate?.(get, set, nextValue)
        return nextValue
      })
    }
  )

  const selectionAtom = atom(
    get => get(selectionPrimitiveAtom),
    (get, set, objects: readonly T[]) => {
      set(updateSelectionAtom, prevSelection => {
        // Assume that the cost of deriving difference here is smaller than
        // triggering state update.
        const maybeObjectsToRemove = difference(prevSelection, objects)
        const maybeObjectsToAdd = difference(objects, prevSelection)
        let objectsToRemove: readonly T[] = []
        let objectsToAdd: readonly T[] = []
        if (maybeObjectsToRemove.length > 0) {
          objectsToRemove = onDeselect(maybeObjectsToRemove)
        }
        if (maybeObjectsToAdd.length > 0) {
          objectsToAdd = onSelect(maybeObjectsToAdd)
        }
        return objectsToRemove.length > 0 || objectsToAdd.length > 0
          ? [...without(prevSelection, ...objectsToRemove), ...objectsToAdd]
          : prevSelection
      })
    }
  )

  const addAtom = atom(null, (get, set, objects: readonly T[]) => {
    set(updateSelectionAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const maybeObjectsToAdd = difference(objects, prevSelection)
      if (maybeObjectsToAdd.length === 0) {
        return prevSelection
      }
      const objectsToAdd = onSelect(maybeObjectsToAdd)
      if (objectsToAdd.length === 0) {
        return prevSelection
      }
      return [...prevSelection, ...objectsToAdd]
    })
  })

  const removeAtom = atom(null, (get, set, objects: readonly T[]) => {
    set(updateSelectionAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const maybeObjectsToRemove = intersection(prevSelection, objects)
      if (maybeObjectsToRemove.length === 0) {
        return prevSelection
      }
      const objectsToRemove = onDeselect(maybeObjectsToRemove)
      if (objectsToRemove.length === 0) {
        return prevSelection
      }
      return without(prevSelection, ...objectsToRemove)
    })
  })

  const clearAtom = atom(null, (get, set) => {
    set(updateSelectionAtom, prevSelection => {
      if (prevSelection.length === 0) {
        return prevSelection
      }
      onDeselect(prevSelection)
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
