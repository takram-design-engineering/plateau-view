import { atom } from 'jotai'
import { groupBy } from 'lodash'

import {
  layersAtom,
  layerSelectionAtom,
  type LayerModel,
  type LayerType
} from '@takram/plateau-layers'
import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry,
  type ScreenSpaceSelectionType
} from '@takram/plateau-screen-space-selection'
import { isNotNullish } from '@takram/plateau-type-helpers'
import { colorSchemeSelectionAtom } from '@takram/plateau-view-layers'

export const LAYER_SELECTION = 'LAYER_SELECTION'
export const SCREEN_SPACE_SELECTION = 'SCREEN_SPACE_SELECTION'
export const COLOR_SCHEME_SELECTION = 'COLOR_SCHEME_SELECTION'

interface LayerSelection {
  type: typeof LAYER_SELECTION
  value: LayerModel
}

interface ScreenSpaceSelection {
  type: typeof SCREEN_SPACE_SELECTION
  value: ScreenSpaceSelectionEntry
}

interface ColorSchemeSelection {
  type: typeof COLOR_SCHEME_SELECTION
  value: LayerModel
}

export type Selection =
  | LayerSelection
  | ScreenSpaceSelection
  | ColorSchemeSelection

export type SelectionType = Selection['type']

export const selectionAtom = atom((get): Selection[] => [
  ...get(layerSelectionAtom)
    .map((id): LayerSelection | undefined => {
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
    (value): ScreenSpaceSelection => ({
      type: SCREEN_SPACE_SELECTION,
      value
    })
  ),
  ...get(colorSchemeSelectionAtom)
    .map((id): ColorSchemeSelection | undefined => {
      const layer = get(layersAtom).find(layer => layer.id === id)
      if (layer == null) {
        console.warn(`Layer does not exit: ${id}`)
      }
      return layer != null
        ? {
            type: COLOR_SCHEME_SELECTION,
            value: layer
          }
        : undefined
    })
    .filter(isNotNullish)
])

type LayerSelectionGroup = {
  type: typeof LAYER_SELECTION
} & {
  [K in LayerType]: {
    subtype: K
    values: Array<LayerModel<K>>
  }
}[LayerType]

type ScreenSpaceSelectionGroup = {
  type: typeof SCREEN_SPACE_SELECTION
} & {
  [K in ScreenSpaceSelectionType]: {
    subtype: K
    values: Array<ScreenSpaceSelectionEntry<K>['value']>
  }
}[ScreenSpaceSelectionType]

type ColorSchemeSelectionGroup = {
  type: typeof COLOR_SCHEME_SELECTION
} & {
  [K in LayerType]: {
    subtype: K
    values: Array<LayerModel<K>>
  }
}[LayerType]

export type SelectionGroup =
  | LayerSelectionGroup
  | ScreenSpaceSelectionGroup
  | ColorSchemeSelectionGroup

export const selectionGroupsAtom = atom<SelectionGroup[]>(get => {
  const groups = Object.entries(
    groupBy(get(selectionAtom), 'type')
  ) as unknown as Array<
    {
      [K in SelectionType]: [K, Array<Selection & { type: K }>]
    }[SelectionType]
  >
  return groups.flatMap(([type, values]) => {
    switch (type) {
      case LAYER_SELECTION:
        return Object.entries(
          groupBy(
            values.map(({ value }) => value),
            'type'
          )
        ).map(([subtype, values]) => ({
          type,
          subtype,
          values
        })) as unknown as SelectionGroup[]
      case SCREEN_SPACE_SELECTION: {
        return Object.entries(
          groupBy(
            values.map(({ value }) => value),
            'type'
          )
        ).map(([subtype, values]) => ({
          type,
          subtype,
          values: values.map(({ value }) => value)
        })) as unknown as SelectionGroup[]
      }
      case COLOR_SCHEME_SELECTION: {
        return Object.entries(
          groupBy(
            values.map(({ value }) => value),
            'type'
          )
        ).map(([subtype, values]) => ({
          type,
          subtype,
          values
        })) as unknown as SelectionGroup[]
      }
    }
    return []
  })
})
