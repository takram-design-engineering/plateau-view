import { atom, type PrimitiveAtom } from 'jotai'

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
  colorMapAtom: PrimitiveAtom<ColorMap>
  colorRangeAtom: PrimitiveAtom<number[]>
  colorSchemeAtom: ViewLayerModel['colorSchemeAtom']
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
          colorRangeAtom
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
    colorMapAtom,
    colorRangeAtom,
    colorSchemeAtom,
    opacityAtom: atom(1)
  }
}
