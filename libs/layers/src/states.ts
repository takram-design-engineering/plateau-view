import { atom, type Getter } from 'jotai'
import { atomWithReset, splitAtom } from 'jotai/utils'
import { isEqual, pick } from 'lodash'
import { nanoid } from 'nanoid'
import { type SetOptional } from 'type-fest'

import { atomsWithSelection } from '@takram/plateau-selection'

import { type LayerModel } from './types'

type LayerPredicate = (layer: LayerModel, get: Getter) => boolean

export const layersAtom = atomWithReset<LayerModel[]>([])
export const layerAtomsAtom = splitAtom(layersAtom)
export const layerIdsAtom = atom(get => get(layersAtom).map(({ id }) => id))

const {
  selectionAtom,
  addAtom: addSelectionAtom,
  removeAtom: removeSelectionAtom,
  clearAtom: clearSelectionAtom
} = atomsWithSelection<string>()

export {
  selectionAtom,
  addSelectionAtom,
  removeSelectionAtom,
  clearSelectionAtom
}

export const addAtom = atom(
  null,
  (get, set, layer: SetOptional<LayerModel, 'id'>) => {
    const id = layer.id ?? nanoid()
    if (get(layerIdsAtom).includes(id)) {
      console.warn(`Layer already exits: ${id}`)
      return () => {}
    }
    set(layerAtomsAtom, {
      type: 'insert',
      value: { ...layer, id }
    })
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

export const findAtom = atom(
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

export const filterAtom = atom(
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

export const removeAtom = atom(null, (get, set, id: string) => {
  const layerAtom = get(layerAtomsAtom).find(
    layerAtom => get(layerAtom).id === id
  )
  if (layerAtom == null) {
    console.warn(`Layer does not exit: ${id}`)
    return
  }
  set(removeSelectionAtom, [id])
  set(layerAtomsAtom, {
    type: 'remove',
    atom: layerAtom
  })
})

export const moveAtom = atom(
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
  }
)
