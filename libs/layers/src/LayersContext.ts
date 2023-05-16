import { atom } from 'jotai'
import { atomWithReset, splitAtom } from 'jotai/utils'
import { nanoid } from 'nanoid'
import { createContext } from 'react'

import { type AnyLayerModel } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const layersAtom = atomWithReset<AnyLayerModel[]>([])

  const layerAtomsAtom = splitAtom(layersAtom)

  const layerIdsAtom = atom(get => get(layersAtom).map(({ id }) => id))

  const addAtom = atom(null, (get, set, layer: Omit<AnyLayerModel, 'id'>) => {
    const id = nanoid()
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
  })

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
    removeAtom,
    moveAtom
  }
}

export type LayersContextValue = ReturnType<typeof createContextValue>

export const LayersContext = createContext<LayersContextValue | null>(null)
