import { atom, type Getter } from 'jotai'
import { atomWithReset, splitAtom } from 'jotai/utils'
import { isEqual, pick } from 'lodash'
import { nanoid } from 'nanoid'
import { createContext } from 'react'
import { type SetOptional } from 'type-fest'

import { type LayerModel } from './types'

type AnyLayerPredicate = (layer: LayerModel, get: Getter) => boolean

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const layersAtom = atomWithReset<LayerModel[]>([])
  const layerAtomsAtom = splitAtom(layersAtom)
  const layerIdsAtom = atom(get => get(layersAtom).map(({ id }) => id))

  const addAtom = atom(
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

  const findAtom = atom(
    null,
    (
      get,
      set,
      layers: readonly LayerModel[],
      predicate: Partial<LayerModel> | AnyLayerPredicate
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

  const filterAtom = atom(
    null,
    (
      get,
      set,
      layers: readonly LayerModel[],
      predicate: Partial<LayerModel> | AnyLayerPredicate
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

  const removeAtom = atom(null, (get, set, id: string) => {
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
  })

  const moveAtom = atom(null, (get, set, activeId: string, overId: string) => {
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
  })

  return {
    layersAtom,
    layerIdsAtom,
    layerAtomsAtom,
    addAtom,
    findAtom,
    filterAtom,
    removeAtom,
    moveAtom
  }
}

export type LayersContextValue = ReturnType<typeof createContextValue>

export const LayersContext = createContext<LayersContextValue | null>(null)
