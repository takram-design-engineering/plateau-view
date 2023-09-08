import { atom, type PrimitiveAtom, type SetStateAction } from 'jotai'

import { colorMapPlateau, type ColorMap } from '@takram/plateau-color-maps'
import {
  type QualitativeColorSet,
  type TileFeatureIndex
} from '@takram/plateau-datasets'

import { type ViewLayerModel } from './createViewLayerModel'
import { type LayerColorScheme } from './types'

export interface PlateauTilesetLayerStateParams {
  hiddenFeatures?: readonly string[]
}

export interface PlateauTilesetLayerState {
  isPlateauTilesetLayer: true
  featureIndexAtom: PrimitiveAtom<TileFeatureIndex | null>
  hiddenFeaturesAtom: PrimitiveAtom<readonly string[] | null>
  propertiesAtom: PrimitiveAtom<readonly PlateauTilesetProperty[] | null>
  colorPropertyAtom: PrimitiveAtom<string | null>
  colorSchemeAtom: ViewLayerModel['colorSchemeAtom']
  colorMapAtom: PrimitiveAtom<ColorMap>
  colorRangeAtom: PrimitiveAtom<number[]>
  opacityAtom: PrimitiveAtom<number>
}

export type PlateauTilesetProperty = { name: string } & (
  | { type: 'unknown' }
  | {
      type: 'number'
      minimum: number
      maximum: number
    }
  | {
      type: 'qualitative'
      colorSet: QualitativeColorSet
    }
)

export function createPlateauTilesetLayerState(
  params: PlateauTilesetLayerStateParams
): PlateauTilesetLayerState {
  const propertiesAtom = atom<readonly PlateauTilesetProperty[] | null>(null)
  const colorPropertyAtom = atom<string | null>(null)
  const colorMapAtom = atom<ColorMap>(colorMapPlateau)
  const colorRangeAtom = atom([0, 100])
  const valueRangeAtom = atom(
    get => {
      const properties = get(propertiesAtom)
      const colorProperty = get(colorPropertyAtom)
      const property =
        colorProperty != null
          ? properties?.find(({ name }) => name === colorProperty)
          : undefined
      return property?.type === 'number'
        ? [property.minimum, property.maximum]
        : []
    },
    (get, set, value: SetStateAction<number[]>) => {
      // Not writable
    }
  )

  const colorSchemeAtom = atom<LayerColorScheme | null>(get => {
    const properties = get(propertiesAtom)
    const colorProperty = get(colorPropertyAtom)
    if (colorProperty == null) {
      return null
    }
    const property = properties?.find(({ name }) => name === colorProperty)
    return property?.type === 'qualitative'
      ? property.colorSet
      : {
          type: 'quantitative',
          name: colorProperty.replaceAll('_', ' '),
          colorMapAtom,
          colorRangeAtom,
          valueRangeAtom
        }
  })

  return {
    isPlateauTilesetLayer: true,
    featureIndexAtom: atom<TileFeatureIndex | null>(null),
    hiddenFeaturesAtom: atom<readonly string[] | null>(
      params.hiddenFeatures ?? null
    ),
    propertiesAtom,
    colorPropertyAtom,
    colorSchemeAtom,
    colorMapAtom,
    colorRangeAtom,
    opacityAtom: atom(1)
  }
}
