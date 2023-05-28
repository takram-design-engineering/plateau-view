import { BoundingSphere } from '@cesium/engine'
import { atom } from 'jotai'

import {
  atomsWithSelection,
  atomsWithTransformSelection
} from '@takram/plateau-shared-states'

import { type ScreenSpaceSelectionHandler } from './ScreenSpaceSelectionHandler'
import {
  type ScreenSpaceSelectionEntry,
  type ScreenSpaceSelectionResponder,
  type ScreenSpaceSelectionType
} from './types'

const responders = new Set<ScreenSpaceSelectionResponder>()

export function becomeResponder<T extends ScreenSpaceSelectionType>(
  responder: ScreenSpaceSelectionResponder<T>
): () => void {
  responders.add(responder as unknown as ScreenSpaceSelectionResponder)
  return () => {
    responders.delete(responder as unknown as ScreenSpaceSelectionResponder)
  }
}

export function resignResponder<T extends ScreenSpaceSelectionType>(
  responder: ScreenSpaceSelectionResponder<T>
): void {
  responders.delete(responder as unknown as ScreenSpaceSelectionResponder)
}

function transform(object: object): ScreenSpaceSelectionEntry | undefined {
  for (const responder of responders) {
    const value = responder.transform(object)
    if (value != null) {
      return value
    }
  }
  return undefined
}

const selectionAtoms = atomsWithSelection<ScreenSpaceSelectionEntry>({
  isEqual: (a, b) => {
    return a.type === b.type && a.value === b.value
  },
  onSelect: value => {
    for (const responder of responders) {
      if (responder.predicate(value)) {
        responder.onSelect?.(value)
        break
      }
    }
  },
  onDeselect: value => {
    for (const responder of responders) {
      if (responder.predicate(value)) {
        responder.onDeselect?.(value)
        break
      }
    }
  }
})

const {
  selectionAtom: screenSpaceSelectionAtom,
  addAtom: addScreenSpaceSelectionAtom,
  removeAtom: removeScreenSpaceSelectionAtom,
  clearAtom: clearScreenSpaceSelectionAtom
} = selectionAtoms

const {
  replaceAtom: replaceScreenSpaceSelectionObjectsAtom,
  addAtom: addScreenSpaceSelectionObjectsAtom,
  removeAtom: removeScreenSpaceSelectionObjectsAtom
} = atomsWithTransformSelection(selectionAtoms, transform)

export {
  screenSpaceSelectionAtom,
  addScreenSpaceSelectionAtom,
  removeScreenSpaceSelectionAtom,
  clearScreenSpaceSelectionAtom,
  replaceScreenSpaceSelectionObjectsAtom,
  addScreenSpaceSelectionObjectsAtom,
  removeScreenSpaceSelectionObjectsAtom
}

export const boundingSphereAtom = atom(get => {
  const boundingSpheres: BoundingSphere[] = []
  const selection = get(screenSpaceSelectionAtom)
  selection.forEach(value => {
    for (const responder of responders) {
      if (responder.predicate(value)) {
        const boundingSphere = responder.computeBoundingSphere?.(value)
        if (boundingSphere != null) {
          boundingSpheres.push(boundingSphere)
        }
        break
      }
    }
  })
  return boundingSpheres.length > 0
    ? BoundingSphere.fromBoundingSpheres(boundingSpheres)
    : undefined
})

export const screenSpaceSelectionHandlerAtom =
  atom<ScreenSpaceSelectionHandler | null>(null)
