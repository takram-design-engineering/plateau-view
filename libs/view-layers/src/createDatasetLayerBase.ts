import { atom, type PrimitiveAtom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { type LayerModel } from '@takram/plateau-layers'

import {
  createViewLayerBase,
  type ViewLayerModelParams
} from './createViewLayerBase'

export interface DatasetLayerModelParams extends ViewLayerModelParams {
  municipalityCode: string
  datasetId: string
  datumId?: string
}

export interface DatasetLayerModel extends LayerModel {
  municipalityCode: string
  datasetId: string
  datumIdAtom: PrimitiveAtom<string | null>
}

export function createDatasetLayerBase(
  params: DatasetLayerModelParams
): Omit<SetOptional<DatasetLayerModel, 'id'>, 'type'> {
  return {
    ...createViewLayerBase(params),
    municipalityCode: params.municipalityCode,
    datasetId: params.datasetId,
    datumIdAtom: atom(params.datumId ?? null)
  }
}
