import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import {
  type MunicipalityDatasetsQuery,
  type PlateauDatasetDatumFragment
} from '@takram/plateau-graphql'
import { type LayerType } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'

import { layerTypeNames } from './layerTypeNames'
import { type LayerTitle } from './types'

export interface DatasetLayerTitleParams {
  layerType: LayerType
  municipality?: MunicipalityDatasetsQuery['municipality']
  datum?: PlateauDatasetDatumFragment
}

export function useDatasetLayerTitle({
  layerType,
  municipality,
  datum
}: DatasetLayerTitleParams): LayerTitle | undefined {
  return useMemo(() => {
    if (municipality == null || datum == null) {
      return
    }
    invariant(municipality.datasets.length > 0)
    const [dataset] = municipality.datasets
    invariant(dataset.data.length > 0)
    return {
      primary: [layerTypeNames[layerType], dataset.name !== '' && dataset.name]
        .filter(isNotFalse)
        .join(' '),
      secondary: municipality.name
    }
  }, [layerType, municipality, datum])
}
