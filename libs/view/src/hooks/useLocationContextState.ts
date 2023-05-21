import { useAtomValue } from 'jotai'
import { groupBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import type { Area } from '@takram/plateau-geocoder'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauDatasetFragment
} from '@takram/plateau-graphql'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { areasAtom } from '../states/address'

const datasetTypeOrder = [
  PlateauDatasetType.Building,
  PlateauDatasetType.Bridge,
  PlateauDatasetType.Border,
  PlateauDatasetType.Landmark,
  PlateauDatasetType.Station,
  PlateauDatasetType.Road,
  PlateauDatasetType.Railway,
  PlateauDatasetType.Park,
  PlateauDatasetType.Landuse,
  PlateauDatasetType.Flood,
  PlateauDatasetType.InlandFlood,
  PlateauDatasetType.Hightide,
  PlateauDatasetType.Landslide,
  PlateauDatasetType.Tsunami,
  PlateauDatasetType.Shelter,
  PlateauDatasetType.EmergencyRoute,
  PlateauDatasetType.Facility,
  PlateauDatasetType.Furniture,
  PlateauDatasetType.Vegetation
]

export interface LocationContextStateState {
  areas?: readonly Area[]
  datasetGroups?: PlateauDatasetFragment[][]
}

export function useLocationContextState(): LocationContextStateState {
  const areas = useAtomValue(areasAtom)
  const { data, loading } = useMunicipalityDatasetsQuery({
    variables:
      areas != null
        ? {
            municipalityCode: areas?.[0].code,
            excludeTypes: [
              PlateauDatasetType.UseCase,
              PlateauDatasetType.Generic
            ]
          }
        : undefined,
    skip: areas == null
  })

  const datasetGroups = useMemo(() => {
    const datasets = data?.municipality?.datasets
    if (datasets == null) {
      return
    }
    const groups = Object.entries(groupBy(datasets, 'type'))
    return datasetTypeOrder
      .map(orderedType => groups.find(([type]) => type === orderedType))
      .filter(isNotNullish)
      .map(([, datasets]) => datasets)
  }, [data])

  const [state, setState] = useState<LocationContextStateState>({})
  useEffect(() => {
    if (!loading) {
      setState({ areas: areas ?? undefined, datasetGroups })
    }
  }, [areas, loading, datasetGroups])

  return state
}
