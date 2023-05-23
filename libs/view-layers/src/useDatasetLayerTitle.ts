import { useMemo } from 'react'

import { type MunicipalityDatasetsQuery } from '@takram/plateau-graphql'
import { type LayerType } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'

import { layerTypeNames } from './layerTypeNames'
import { type LayerTitle } from './types'
import { type DatasetDatum } from './useDatasetDatum'
import { useMunicipalityName } from './useMunicipalityName'

export interface DatasetLayerTitleParams {
  layerType: LayerType
  municipality?: MunicipalityDatasetsQuery['municipality']
  datum?: DatasetDatum
}

export function useDatasetLayerTitle({
  layerType,
  municipality,
  datum
}: DatasetLayerTitleParams): LayerTitle | undefined {
  const municipalityName = useMunicipalityName(municipality)
  return useMemo(() => {
    if (municipality == null || datum == null) {
      return
    }
    return {
      primary: [
        layerTypeNames[layerType],
        datum.dataset.name !== '' && datum.dataset.name
      ]
        .filter(isNotFalse)
        .join(' '),
      secondary: municipalityName
    }
  }, [layerType, municipality, datum, municipalityName])
}
