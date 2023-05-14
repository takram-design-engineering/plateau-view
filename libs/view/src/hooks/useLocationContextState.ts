import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauDatasetFragment
} from '@plateau/graphql'

import { municipalityAddressAtom } from '../states/address'
import { type ReverseGeocoderResult } from './useReverseGeocoder'

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
  address?: ReverseGeocoderResult<'municipality'>
  datasets?: PlateauDatasetFragment[]
}

export function useLocationContextState(): LocationContextStateState {
  const address = useAtomValue(municipalityAddressAtom)
  const { data, loading } = useMunicipalityDatasetsQuery({
    variables:
      address != null
        ? {
            municipalityCode: address?.municipalityCode,
            excludeTypes: [
              PlateauDatasetType.UseCase,
              PlateauDatasetType.Generic
            ]
          }
        : undefined,
    skip: address == null
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
      setState({ address: address ?? undefined, datasets })
    }
  }, [address, loading, datasets])

  return state
}
