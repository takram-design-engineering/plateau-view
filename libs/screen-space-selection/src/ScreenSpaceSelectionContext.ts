import { BoundingSphere } from '@cesium/engine'
import { atom, type Getter, type Setter } from 'jotai'
import { createContext } from 'react'

import { atomsWithSelection } from '@takram/plateau-selection'

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

  function handleUpdate(
    get: Getter,
    set: Setter,
    objects: readonly object[]
  ): void {
    // Update bounding sphere of the selection.
    let boundingSpheres: BoundingSphere[] = []
    for (const object of objects) {
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
  }

  const selectionAtoms = atomsWithSelection({
    onSelect: handleSelect,
    onDeselect: handleDeselect,
    onUpdate: handleUpdate
  })

  const handlerAtom = atom<ScreenSpaceSelectionHandler | null>(null)

  return {
    ...selectionAtoms,
    becomeResponder,
    resignResponder,
    boundingSphereAtom,
    handlerAtom
  }
}

export type ScreenSpaceSelectionContextValue = ReturnType<
  typeof createContextValue
>

export const ScreenSpaceSelectionContext = createContext(createContextValue())
