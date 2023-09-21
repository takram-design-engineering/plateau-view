import { atom } from 'jotai'
import { fromPairs, uniq, without } from 'lodash'

import { match } from '@takram/plateau-cesium-helpers'
import { featureSelectionAtom } from '@takram/plateau-datasets'
import { layersAtom, type LayerModel } from '@takram/plateau-layers'
import { pedestrianSelectionAtom } from '@takram/plateau-pedestrian'
import { atomsWithSelection } from '@takram/plateau-shared-states'
import { sketchSelectionAtom } from '@takram/plateau-sketch'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { type PlateauTilesetLayerState } from './createPlateauTilesetLayerState'
import { PEDESTRIAN_LAYER, SKETCH_LAYER } from './layerTypes'
import { type PedestrianLayerModel } from './PedestrianLayer'
import { type SketchLayerModel } from './SketchLayer'

export const pixelRatioAtom = atom(1)

export const tilesetLayersAtom = atom(get =>
  get(layersAtom).filter(
    (layer): layer is Extract<LayerModel, PlateauTilesetLayerState> =>
      'isPlateauTilesetLayer' in layer
  )
)

export const pedestrianLayersAtom = atom(get =>
  get(layersAtom).filter(
    (layer): layer is PedestrianLayerModel => layer.type === PEDESTRIAN_LAYER
  )
)

export const sketchLayersAtom = atom(get =>
  get(layersAtom).filter(
    (layer): layer is SketchLayerModel => layer.type === SKETCH_LAYER
  )
)

export const highlightedTilesetLayersAtom = atom(get => {
  const featureKeys = get(featureSelectionAtom).map(({ value }) => value.key)
  const tilesetLayers = get(tilesetLayersAtom)
  return tilesetLayers.filter(layer => {
    const featureIndex = get(layer.featureIndexAtom)
    return (
      featureIndex != null && featureKeys.some(key => featureIndex.has(key))
    )
  })
})

export const highlightedPedestrianLayersAtom = atom(get => {
  const entityIds = get(pedestrianSelectionAtom).map(({ value }) => value)
  const pedestrianLayers = get(pedestrianLayersAtom)
  return pedestrianLayers.filter(layer =>
    entityIds.some(entityId =>
      match(entityId, { type: 'Pedestrian', key: layer.id })
    )
  )
})

export const highlightedSketchLayersAtom = atom(get => {
  const entityIds = get(sketchSelectionAtom).map(({ value }) => value)
  const sketchLayers = get(sketchLayersAtom)
  return sketchLayers.filter(layer => {
    const features = get(layer.featuresAtom)
    return entityIds.some(entityId =>
      features.some(feature =>
        match(entityId, { type: 'Sketch', key: feature.properties.id })
      )
    )
  })
})

export const highlightedLayersAtom = atom(get => {
  // TODO: Support other types of selection.
  return [
    ...get(highlightedTilesetLayersAtom),
    ...get(highlightedPedestrianLayersAtom),
    ...get(highlightedSketchLayersAtom)
  ]
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

export const showFeaturesAtom = atom(
  null,
  (get, set, value: readonly string[] | null) => {
    const layers = get(tilesetLayersAtom)
    layers.forEach(({ hiddenFeaturesAtom }) => {
      set(hiddenFeaturesAtom, prevValue => {
        if (value == null) {
          return null
        }
        const nextValue = without(prevValue, ...value)
        return nextValue.length === prevValue?.length
          ? prevValue
          : nextValue.length > 0
          ? nextValue
          : null
      })
    })
  }
)

export const showAllFeaturesAtom = atom(null, (get, set) => {
  const layers = get(tilesetLayersAtom)
  layers.forEach(({ hiddenFeaturesAtom }) => {
    set(hiddenFeaturesAtom, null)
  })
})

const {
  selectionAtom: colorSchemeSelectionAtom,
  addAtom: addColorSchemeSelectionAtom,
  removeAtom: removeColorSchemeSelectionAtom,
  clearAtom: clearColorSchemeSelectionAtom
} = atomsWithSelection<string>()

export {
  colorSchemeSelectionAtom,
  addColorSchemeSelectionAtom,
  removeColorSchemeSelectionAtom,
  clearColorSchemeSelectionAtom
}
