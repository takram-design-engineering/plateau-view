import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

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
}

export function createPlateauTilesetLayerBase(
  params: PlateauTilesetLayerModelParams
): Omit<SetOptional<PlateauTilesetLayerModel, 'id'>, 'type'> {
  return {
    ...createDatasetLayerBase(params),
    isPlateauTilesetLayer: true,
    featureIndexAtom: atom<TileFeatureIndex | null>(null),
    hiddenFeaturesAtom: atom<readonly string[] | null>(null)
  }
}
