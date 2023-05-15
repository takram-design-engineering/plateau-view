import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauDatasetFragment
} from '@plateau/graphql'
import type { Area } from '@plateau/gsi-geocoder'

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
  datasets?: PlateauDatasetFragment[]
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

  const datasets = useMemo(() => {
    const datasets = data?.municipality?.datasets
    if (datasets == null) {
      return
    }
    // TODO: Address multiple datasets of the same type.
    return datasetTypeOrder
      .map(type => datasets.filter(dataset => dataset.type === type))
      .filter(datasets => datasets.length === 1)
      .flat()
  }, [data])

  const [state, setState] = useState<LocationContextStateState>({})
  useEffect(() => {
    if (!loading) {
      setState({ areas: areas ?? undefined, datasets })
    }
  }, [areas, loading, datasets])

  return state
}
