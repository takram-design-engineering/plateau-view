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
  (get, set, gmlIndex: TileFeatureIndex) => {
    const gmlIndexSet = new Set(get(featureIndicesPrimitiveAtom))
    if (gmlIndexSet.has(gmlIndex)) {
      console.warn('GML index already exists.')
      return () => {}
    }
    gmlIndexSet.add(gmlIndex)
    set(featureIndicesPrimitiveAtom, Array.from(gmlIndexSet))
    return () => {
      set(removeFeatureIndexAtom, gmlIndex)
    }
  }
)

export const removeFeatureIndexAtom = atom(
  null,
  (get, set, gmlIndex: TileFeatureIndex) => {
    const gmlIndexSet = new Set(get(featureIndicesPrimitiveAtom))
    if (!gmlIndexSet.has(gmlIndex)) {
      console.warn('GML index does not exist.')
      return () => {}
    }
    gmlIndexSet.delete(gmlIndex)
    set(featureIndicesPrimitiveAtom, Array.from(gmlIndexSet))
  }
)
