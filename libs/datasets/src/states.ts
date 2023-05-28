import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import { type TileFeatureIndex } from './TileFeatureIndex'

export const showTilesetTextureAtom = atomWithReset(true)
export const showTilesetWireframeAtom = atomWithReset(false)
export const showTilesetBoundingVolumeAtom = atomWithReset(false)

const featureIndicesPrimitiveAtom = atomWithReset<TileFeatureIndex[]>([])
export const featureIndicesAtom = atom(get => get(featureIndicesPrimitiveAtom))

export const addFeatureIndexAtom = atom(
  null,
  (get, set, index: TileFeatureIndex) => {
    const indexSet = new Set(get(featureIndicesPrimitiveAtom))
    if (indexSet.has(index)) {
      console.warn('GML index already exists.')
      return () => {}
    }
    indexSet.add(index)
    set(featureIndicesPrimitiveAtom, Array.from(indexSet))
    return () => {
      set(removeFeatureIndexAtom, index)
    }
  }
)

export const removeFeatureIndexAtom = atom(
  null,
  (get, set, index: TileFeatureIndex) => {
    const indexSet = new Set(get(featureIndicesPrimitiveAtom))
    if (!indexSet.has(index)) {
      console.warn('GML index does not exist.')
      return () => {}
    }
    indexSet.delete(index)
    set(featureIndicesPrimitiveAtom, Array.from(indexSet))
  }
)
