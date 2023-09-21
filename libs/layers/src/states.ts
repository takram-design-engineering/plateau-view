import { atom } from 'jotai'
import { atomWithReset, splitAtom } from 'jotai/utils'
import { isEqual, pick } from 'lodash'
import { nanoid } from 'nanoid'
import { type SetOptional } from 'type-fest'

import { atomsWithSelection } from '@takram/plateau-shared-states'

import { type LayerModel, type LayerPredicate } from './types'

// TODO: Rewrite with atomFamily perhaps?
export const layersAtom = atomWithReset<LayerModel[]>([])
export const layerAtomsAtom = splitAtom(layersAtom)
export const layerIdsAtom = atom(get =>
  get(layerAtomsAtom).map(layerAtom => get(layerAtom).id)
)

const {
  selectionAtom: layerSelectionAtom,
  addAtom: addLayerSelectionAtom,
  removeAtom: removeLayerSelectionAtom,
  clearAtom: clearLayerSelectionAtom
} = atomsWithSelection<string>()

export {
  layerSelectionAtom,
  addLayerSelectionAtom,
  removeLayerSelectionAtom,
  clearLayerSelectionAtom
}

export interface AddLayerOptions {
  autoSelect?: boolean
}

export const addLayerAtom = atom(
  null,
  (
    get,
    set,
    layer: SetOptional<LayerModel, 'id'>,
    { autoSelect = true }: AddLayerOptions = {}
  ) => {
    const id = layer.id ?? nanoid()
    if (get(layerIdsAtom).includes(id)) {
      console.warn(`Layer already exits: ${id}`)
      return () => {}
    }
    set(layerAtomsAtom, {
      type: 'insert',
      value: { ...layer, id },
      before: get(layerAtomsAtom)[0]
    })
    if (autoSelect) {
      set(layerSelectionAtom, [id])
    }

    return () => {
      const layerAtom = get(layerAtomsAtom).find(
        layerAtom => get(layerAtom).id === id
      )
      if (layerAtom == null) {
        console.warn(`Layer does not exit: ${id}`)
        return
      }
      set(layerAtomsAtom, {
        type: 'remove',
        atom: layerAtom
      })
    }
  }
)

export const findLayerAtom = atom(
  null,
  (
    get,
    set,
    layers: readonly LayerModel[],
    predicate: Partial<LayerModel> | LayerPredicate
  ) => {
    if (typeof predicate === 'function') {
      return layers.find(layerAtom => predicate(layerAtom, get))
    }
    const keys = Object.entries(predicate)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key)
    const layer = layers.find(layer => isEqual(pick(layer, keys), predicate))
    return layer != null ? layer : undefined
  }
)

export const filterLayersAtom = atom(
  null,
  (
    get,
    set,
    layers: readonly LayerModel[],
    predicate: Partial<LayerModel> | LayerPredicate
  ) => {
    if (typeof predicate === 'function') {
      return layers.filter(layer => predicate(layer, get))
    }
    const keys = Object.entries(predicate)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => key)
    return layers.filter(layer => isEqual(pick(layer, keys), predicate))
  }
)

export const removeLayerAtom = atom(null, (get, set, id: string) => {
  const layerAtom = get(layerAtomsAtom).find(
    layerAtom => get(layerAtom).id === id
  )
  if (layerAtom == null) {
    console.warn(`Layer does not exit: ${id}`)
    return
  }
  set(removeLayerSelectionAtom, [id])
  set(layerAtomsAtom, {
    type: 'remove',
    atom: layerAtom
  })
})

export const moveLayerAtom = atom(
  null,
  (get, set, activeId: string, overId: string) => {
    const layerAtoms = get(layerAtomsAtom)
    const activeIndex = layerAtoms.findIndex(
      layerAtom => get(layerAtom).id === activeId
    )
    if (activeIndex === -1) {
      console.warn(`Layer does not exit: ${activeId}`)
      return
    }
    const overIndex = layerAtoms.findIndex(
      layerAtom => get(layerAtom).id === overId
    )
    if (overIndex === -1) {
      console.warn(`Layer does not exit: ${overId}`)
      return
    }
    set(layerAtomsAtom, {
      type: 'move',
      atom: layerAtoms[activeIndex],
      before:
        activeIndex > overIndex
          ? layerAtoms[overIndex]
          : layerAtoms[overIndex + 1]
    })

    const layers = get(layersAtom)
    const layerIndex = Math.max(activeIndex, overIndex)
    layers
      .slice(0, layerIndex)
      .reverse()
      .forEach(layer => {
        layer.handleRef.current?.bringToFront()
      })
  }
)
