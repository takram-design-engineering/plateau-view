import { atom, type PrimitiveAtom } from 'jotai'

import { type LayerModelBase } from '@takram/plateau-layers'

import {
  createViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { type ConfigurableLayerModelBase } from './types'

export interface DatasetLayerModelParams extends ViewLayerModelParams {
  municipalityCode: string
  datasetId: string
  datumId?: string
}

export interface DatasetLayerModel extends LayerModelBase {
  isDatasetLayer: true
  municipalityCode: string
  datasetId: string
  datumIdAtom: PrimitiveAtom<string | null>
}

export function createDatasetLayerModel(
  params: DatasetLayerModelParams
): ConfigurableLayerModelBase<DatasetLayerModel> {
  return {
    ...createViewLayerModel(params),
    isDatasetLayer: true,
    municipalityCode: params.municipalityCode,
    datasetId: params.datasetId,
    datumIdAtom: atom(params.datumId ?? null)
  }
}
