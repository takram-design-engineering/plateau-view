import { BoundingSphere } from '@cesium/engine'
import { atom } from 'jotai'

import { compose } from '@takram/plateau-cesium-helpers'
import {
  atomsWithSelection,
  atomsWithSelectionTransform
} from '@takram/plateau-shared-states'

import { type ScreenSpaceSelectionHandler } from './ScreenSpaceSelectionHandler'
import {
  type ScreenSpaceSelectionEntry,
  type ScreenSpaceSelectionKeyedValue,
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
    const value = responder.convertToSelection(object)
    if (value != null) {
      return value
    }
  }
  return undefined
}

const selectionAtoms = atomsWithSelection<ScreenSpaceSelectionEntry>({
  getKey: value => {
    // Don't remove type assertion.
    return compose({
      type: value.type,
      key:
        typeof value.value === 'object'
          ? (value.value as unknown as ScreenSpaceSelectionKeyedValue).key
          : value.value
    })
  },
  onSelect: value => {
    for (const responder of responders) {
      if (responder.shouldRespondToSelection(value)) {
        responder.onSelect?.(value)
        break
      }
    }
  },
  onDeselect: value => {
    for (const responder of responders) {
      if (responder.shouldRespondToSelection(value)) {
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
} = atomsWithSelectionTransform(selectionAtoms, transform)

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
      if (responder.shouldRespondToSelection(value)) {
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
