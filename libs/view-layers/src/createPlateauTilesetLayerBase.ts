import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

import {
  colorSchemeViridis,
  type ColorScheme
} from '@takram/plateau-color-schemes'
import { type TileFeatureIndex } from '@takram/plateau-datasets'

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'

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
  colorSchemeAtom: PrimitiveAtom<ColorScheme>
  colorRangeAtom: PrimitiveAtom<[number, number]>
  opacityAtom: PrimitiveAtom<number>
}

export type PlateauTilesetProperty = { name: string } & (
  | { type: 'unknown' }
  | {
      type: 'number'
      minimum: number
      maximum: number
    }
)

export function createPlateauTilesetLayerBase(
  params: PlateauTilesetLayerModelParams
): Omit<SetOptional<PlateauTilesetLayerModel, 'id'>, 'type'> {
  return {
    ...createDatasetLayerBase(params),
    isPlateauTilesetLayer: true,
    featureIndexAtom: atom<TileFeatureIndex | null>(null),
    hiddenFeaturesAtom: atom<readonly string[] | null>(null),
    propertiesAtom: atom<readonly PlateauTilesetProperty[] | null>(null),
    colorPropertyAtom: atom<string | null>(null),
    colorSchemeAtom: atom<ColorScheme>(colorSchemeViridis),
    colorRangeAtom: atom([0, 100]),
    opacityAtom: atom(1)
  }
}
