import { BoundingSphere } from '@cesium/engine'
import { atom, type SetStateAction } from 'jotai'
import { difference, intersection, without } from 'lodash'
import { createContext } from 'react'

import { type ScreenSpaceSelectionHandler } from './ScreenSpaceSelectionHandler'

type ComputeBoundingSphere<T = object> = (
  object: T,
  result?: BoundingSphere
) => BoundingSphere | undefined

export interface ScreenSpaceSelectionResponder<T extends object = object> {
  predicate: (object: object) => object is T
  onSelect: (objects: readonly T[]) => void
  onDeselect: (objects: readonly T[]) => void
  computeBoundingSphere?: ComputeBoundingSphere<T>
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const colorModeAtom = atom<'light' | 'dark'>('light')

  const responders = new Set<ScreenSpaceSelectionResponder>()

  function becomeResponder<T extends object>(
    responder: ScreenSpaceSelectionResponder<T>
  ): () => void {
    responders.add(responder as unknown as ScreenSpaceSelectionResponder)
    return () => {
      responders.delete(responder as unknown as ScreenSpaceSelectionResponder)
    }
  }

  function resignResponder<T extends object>(
    responder: ScreenSpaceSelectionResponder<T>
  ): void {
    responders.delete(responder as unknown as ScreenSpaceSelectionResponder)
  }

  const selectionPrimitiveAtom = atom<object[]>([])
  const selectionAtom = atom(get => get(selectionPrimitiveAtom))

  const boundingSphereCache = new WeakMap<object, BoundingSphere | null>()
  const boundingSpherePrimitiveAtom = atom<BoundingSphere | null>(null)
  const boundingSphereAtom = atom(get => get(boundingSpherePrimitiveAtom))

  function cacheBoundingSpheres(
    objects: readonly object[],
    computeBoundingSphere?: ComputeBoundingSphere
  ): void {
    objects.forEach(object => {
      // Set null for denoting that bounding sphere cannot be computed.
      boundingSphereCache.set(object, computeBoundingSphere?.(object) ?? null)
    })
  }

  const updateSelectionAtom = atom(
    null,
    (get, set, value: SetStateAction<object[]>) => {
      set(selectionPrimitiveAtom, prevValue => {
        const nextValue = typeof value === 'function' ? value(prevValue) : value

        // Update bounding sphere of the selection.
        let boundingSpheres: BoundingSphere[] = []
        for (const object of nextValue) {
          const boundingSphere = boundingSphereCache.get(object)
          if (boundingSphere == null) {
            boundingSpheres = []
            break // Abort if any object has no bounding sphere.
          }
          boundingSpheres.push(boundingSphere)
        }
        set(
          boundingSpherePrimitiveAtom,
          boundingSpheres.length > 0
            ? BoundingSphere.fromBoundingSpheres(boundingSpheres)
            : null
        )

        return nextValue
      })
    }
  )

  function handleSelect(objects: readonly object[]): object[] {
    const results: object[] = []
    responders.forEach(responder => {
      const filteredObjects = objects.filter(responder.predicate)
      if (filteredObjects.length > 0) {
        responder.onSelect(filteredObjects)
        cacheBoundingSpheres(filteredObjects, responder.computeBoundingSphere)
        results.push(...filteredObjects)
      }
    })
    return results
  }

  function handleDeselect(objects: readonly object[]): object[] {
    const results: object[] = []
    responders.forEach(responder => {
      const filteredObjects = objects.filter(responder.predicate)
      if (filteredObjects.length > 0) {
        responder.onDeselect(filteredObjects)
        results.push(...filteredObjects)
      }
    })
    return results
  }

  const replaceAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(updateSelectionAtom, prevSelection => {
      // Assume that the cost of deriving difference here is smaller than
      // triggering state update.
      const maybeObjectsToRemove = difference(prevSelection, objects)
      const maybeObjectsToAdd = difference(objects, prevSelection)
      let objectsToRemove: object[] = []
      let objectsToAdd: object[] = []
      if (maybeObjectsToRemove.length > 0) {
        objectsToRemove = handleDeselect(maybeObjectsToRemove)
      }
      if (maybeObjectsToAdd.length > 0) {
        objectsToAdd = handleSelect(maybeObjectsToAdd)
      }
      return objectsToRemove.length > 0 || objectsToAdd.length > 0
        ? [...without(prevSelection, ...objectsToRemove), ...objectsToAdd]
        : prevSelection
    })
  })

  const addAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(updateSelectionAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const maybeObjectsToAdd = difference(objects, prevSelection)
      if (maybeObjectsToAdd.length === 0) {
        return prevSelection
      }
      const objectsToAdd = handleSelect(maybeObjectsToAdd)
      if (objectsToAdd.length === 0) {
        return prevSelection
      }
      return [...prevSelection, ...objectsToAdd]
    })
  })

  const removeAtom = atom(null, (get, set, objects: readonly object[]) => {
    set(updateSelectionAtom, prevSelection => {
      if (objects.length === 0) {
        return prevSelection
      }
      const maybeObjectsToRemove = intersection(prevSelection, objects)
      if (maybeObjectsToRemove.length === 0) {
        return prevSelection
      }
      const objectsToRemove = handleDeselect(maybeObjectsToRemove)
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
      handleDeselect(prevSelection)
      return []
    })
  })

  const handlerAtom = atom<ScreenSpaceSelectionHandler | null>(null)

  return {
    colorModeAtom,
    becomeResponder,
    resignResponder,
    selectionAtom,
    boundingSphereAtom,
    replaceAtom,
    addAtom,
    removeAtom,
    clearAtom,
    handlerAtom
  }
}

export type ScreenSpaceSelectionContextValue = ReturnType<
  typeof createContextValue
>

export const ScreenSpaceSelectionContext = createContext(createContextValue())
