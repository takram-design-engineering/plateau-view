import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

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
  hiddenFeaturesAtom: PrimitiveAtom<readonly string[] | null>
}

export function createPlateauTilesetLayerBase(
  params: PlateauTilesetLayerModelParams
): Omit<SetOptional<PlateauTilesetLayerModel, 'id'>, 'type'> {
  return {
    ...createDatasetLayerBase(params),
    hiddenFeaturesAtom: atom<readonly string[] | null>(null)
  }
}
