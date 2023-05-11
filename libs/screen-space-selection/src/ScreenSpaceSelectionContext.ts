import { Event, type BoundingSphere } from '@cesium/engine'
import { atom } from 'jotai'
import { difference, intersection, uniq, without } from 'lodash'
import { createContext } from 'react'

import { type ScreenSpaceSelectionHandler } from './ScreenSpaceSelectionHandler'

export interface ScreenSpaceSelectionDelegate<T extends object = object> {
  predicate: (object: object) => object is T
  onSelect: (objects: readonly T[]) => void
  onDeselect: (objects: readonly T[]) => void
  computeBoundingSphere: (
    object: T,
    result?: BoundingSphere
  ) => BoundingSphere | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const colorModeAtom = atom<'light' | 'dark'>('light')

  const selectionPrimitiveAtom = atom<object[]>([])
  const selectionAtom = atom(get => get(selectionPrimitiveAtom))

  const deselectEventAtom = atom(
    new Event<(objects: readonly object[]) => void>()
  )
  const selectEventAtom = atom(
    new Event<(objects: readonly object[]) => void>()
  )

  const delegates = new WeakMap<object, ScreenSpaceSelectionDelegate>()
  const delegateAtom = atom(
    null,
    (get, set, object: object, delegate: ScreenSpaceSelectionDelegate) => {
      delegates.set(object, delegate)
    }
  )

  const replaceAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      // Assume that the cost of deriving difference here is smaller than
      // triggering state update.
      const objectsToRemove = difference(prevSelection, objects)
      const objectsToAdd = difference(objects, prevSelection)
      if (objectsToRemove.length > 0) {
        get(deselectEventAtom).raiseEvent(objectsToRemove)
      }
      if (objectsToAdd.length > 0) {
        get(selectEventAtom).raiseEvent(objectsToAdd)
      }
      return objectsToRemove.length > 0 || objectsToAdd.length > 0
        ? uniq(objects)
        : prevSelection
    })
  })

  const addAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const objectsToAdd = difference(objects, prevSelection)
      if (objectsToAdd.length === 0) {
        return prevSelection
      }
      get(selectEventAtom).raiseEvent(objectsToAdd)
      return [...prevSelection, ...objectsToAdd]
    })
  })

  const removeAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const objectsToRemove = intersection(prevSelection, objects)
      if (objectsToRemove.length === 0) {
        return prevSelection
      }
      get(deselectEventAtom).raiseEvent(objectsToRemove)
      return without(prevSelection, ...objectsToRemove)
    })
  })

  const clearAtom = atom(null, (get, set) => {
    set(selectionPrimitiveAtom, prevSelection => {
      if (prevSelection.length === 0) {
        return prevSelection
      }
      get(deselectEventAtom).raiseEvent(prevSelection)
      return []
    })
  })

  const handlerAtom = atom<ScreenSpaceSelectionHandler | null>(null)

  return {
    colorModeAtom,
    selectionAtom,
    selectEventAtom,
    deselectEventAtom,
    delegateAtom,
    replaceAtom,
    addAtom,
    removeAtom,
    clearAtom,
    handlerAtom
  }
}

export const ScreenSpaceSelectionContext = createContext(createContextValue())
