import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { colorMapPlateau, type ColorMap } from '@takram/plateau-color-maps'
import {
  type QualitativeColorSet,
  type TileFeatureIndex
} from '@takram/plateau-datasets'

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { type LayerColorScheme } from './types'

export interface PlateauTilesetLayerModelParams
  extends DatasetLayerModelParams {
  hiddenFeatures?: readonly string[]
}

export interface PlateauTilesetLayerModel extends DatasetLayerModel {
  isPlateauTilesetLayer: true
  featureIndexAtom: PrimitiveAtom<TileFeatureIndex | null>
  hiddenFeaturesAtom: PrimitiveAtom<readonly string[] | null>
  propertiesAtom: PrimitiveAtom<readonly PlateauTilesetProperty[] | null>
  colorPropertyAtom: PrimitiveAtom<string | null>
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

export function createPlateauTilesetLayerBase(
  params: PlateauTilesetLayerModelParams
): Omit<SetOptional<PlateauTilesetLayerModel, 'id'>, 'type'> {
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
          name: colorProperty,
          colorMapAtom,
          colorRangeAtom
        }
  })

  return {
    ...createDatasetLayerBase(params),
    isPlateauTilesetLayer: true,
    featureIndexAtom: atom<TileFeatureIndex | null>(null),
    hiddenFeaturesAtom: atom<readonly string[] | null>(null),
    propertiesAtom,
    colorPropertyAtom,
    colorMapAtom,
    colorRangeAtom,
    colorSchemeAtom,
    opacityAtom: atom(1)
  }
}
