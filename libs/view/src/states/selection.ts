import { atom } from 'jotai'

import {
  layerSelectionAtom,
  layersAtom,
  type LayerModel
} from '@takram/plateau-layers'
import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'
import { isNotNullish } from '@takram/plateau-type-helpers'

export const LAYER_SELECTION = 'LAYER_SELECTION'
export const SCREEN_SPACE_SELECTION = 'SCREEN_SPACE_SELECTION'

export type Selection =
  | {
      type: typeof LAYER_SELECTION
      value: LayerModel
    }
  | {
      type: typeof SCREEN_SPACE_SELECTION
      value: ScreenSpaceSelectionEntry
    }

export const selectionAtom = atom(get => [
  ...get(layerSelectionAtom)
    .map((id): (Selection & { type: typeof LAYER_SELECTION }) | undefined => {
      const layer = get(layersAtom).find(layer => layer.id === id)
      if (layer == null) {
        console.warn(`Layer does not exit: ${id}`)
      }
      return layer != null
        ? {
            type: LAYER_SELECTION,
            value: layer
          }
        : undefined
    })
    .filter(isNotNullish),
  ...get(screenSpaceSelectionAtom).map(
    (value): Selection & { type: typeof SCREEN_SPACE_SELECTION } => ({
      type: SCREEN_SPACE_SELECTION,
      value
    })
  )
])
