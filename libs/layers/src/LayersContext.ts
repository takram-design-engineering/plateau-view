import { atom, type Getter } from 'jotai'
import { atomWithReset, splitAtom } from 'jotai/utils'
import { isEqual, pick } from 'lodash'
import { nanoid } from 'nanoid'
import { createContext } from 'react'
import { type SetOptional } from 'type-fest'

import { type AnyLayerModel } from './types'

type AnyLayerPredicate = (layer: AnyLayerModel, get: Getter) => boolean

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const layersAtom = atomWithReset<AnyLayerModel[]>([])
  const layerAtomsAtom = splitAtom(layersAtom)
  const layerIdsAtom = atom(get => get(layersAtom).map(({ id }) => id))

  const addAtom = atom(
    null,
    (get, set, layer: SetOptional<AnyLayerModel, 'id'>) => {
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
      layerOrPredicate: Partial<AnyLayerModel> | AnyLayerPredicate
    ) => {
      if (typeof layerOrPredicate === 'function') {
        return get(layersAtom).find(layerAtom =>
          layerOrPredicate(layerAtom, get)
        )
      }
      const keys = Object.entries(layerOrPredicate)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key)
      const layer = get(layersAtom).find(layer =>
        isEqual(pick(layer, keys), layerOrPredicate)
      )
      return layer != null ? layer : undefined
    }
  )

  const filterAtom = atom(
    null,
    (
      get,
      set,
      layerOrPredicate: Partial<AnyLayerModel> | AnyLayerPredicate
    ) => {
      if (typeof layerOrPredicate === 'function') {
        return get(layersAtom).filter(layer => layerOrPredicate(layer, get))
      }
      const keys = Object.entries(layerOrPredicate)
        .filter(([, value]) => value !== undefined)
        .map(([key]) => key)
      return get(layersAtom).filter(layer =>
        isEqual(pick(layer, keys), layerOrPredicate)
      )
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