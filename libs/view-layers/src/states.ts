import { atom } from 'jotai'
import { fromPairs, uniq } from 'lodash'

import { PLATEAU_TILESET } from '@takram/plateau-datasets'
import { layersAtom } from '@takram/plateau-layers'
import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'

export const pixelRatioAtom = atom(2)

export const tilesetLayersAtom = atom(get => {
  const layers = get(layersAtom)
  return layers.filter(
    (layer): layer is PlateauTilesetLayerModel =>
      'isPlateauTilesetLayer' in layer
  )
})

export const highlightedLayersAtom = atom(get => {
  // TODO: Support other types of selection.
  const screenSpaceSelection = get(screenSpaceSelectionAtom)
  const featureKeys = screenSpaceSelection
    .filter(
      (entry): entry is ScreenSpaceSelectionEntry<typeof PLATEAU_TILESET> =>
        entry.type === PLATEAU_TILESET
    )
    .map(({ value }) => value.key)

  const tilesetLayers = get(tilesetLayersAtom)
  return tilesetLayers.filter(layer => {
    const featureIndex = get(layer.featureIndexAtom)
    return (
      featureIndex != null && featureKeys.some(key => featureIndex.has(key))
    )
  })
})

export const featureIndicesAtom = atom(get => {
  const layers = get(tilesetLayersAtom)
  return fromPairs(
    layers
      .map(layer => {
        const featureIndex = get(layer.featureIndexAtom)
        return featureIndex != null ? [layer.id, featureIndex] : undefined
      })
      .filter(isNotNullish)
  )
})

export const findFeaturesAtom = atom(null, (get, set, key: string) => {
  const indices = get(featureIndicesAtom)
  for (const [layerId, index] of Object.entries(indices)) {
    const features = index.find(key)
    if (features != null) {
      return { layerId, features }
    }
  }
  return undefined
})

export const hideFeaturesAtom = atom(
  null,
  (get, set, value: readonly string[] | null) => {
    const layers = get(tilesetLayersAtom)
    layers.forEach(({ id: layerId, hiddenFeaturesAtom }) => {
      const featureIndex = get(featureIndicesAtom)[layerId]
      const nextValue = value?.filter(value => featureIndex.has(value))
      set(hiddenFeaturesAtom, prevValue =>
        prevValue != null || nextValue != null
          ? uniq([...(prevValue ?? []), ...(nextValue ?? [])])
          : null
      )
    })
  }
)

export const showAllFeaturesAtom = atom(null, (get, set) => {
  const layers = get(tilesetLayersAtom)
  layers.forEach(({ hiddenFeaturesAtom }) => {
    set(hiddenFeaturesAtom, null)
  })
})
