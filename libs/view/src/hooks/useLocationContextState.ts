import { useAtomValue } from 'jotai'
import { groupBy } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

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

export interface LocationContextState {
  areas?: readonly Area[]
  datasetGroups?: PlateauDatasetFragment[][]
  focusedAreaCode?: string
  focusArea: (areaCode?: string) => void
  preventChanges: () => void
  approveChanges: () => void
}

// TODO: It's too complex and I'm not sure all the state are synchronized.
// Refactor or write tests.
export function useLocationContextState(): LocationContextState {
  const areas = useAtomValue(areasAtom)

  // Prevents changes in location state when the user is about to click the
  // buttons on the context bar. Commits the pending change when it's approved.
  const [changesPrevented, setChangesPrevented] = useState(false)
  const preventChanges = useCallback(() => {
    setChangesPrevented(true)
  }, [])
  const approveChanges = useCallback(() => {
    setChangesPrevented(false)
  }, [])

  const [focusedAreaCode, setFocusedAreaCode] = useState<string>()
  const focusArea = useCallback((areaCode?: string) => {
    setFocusedAreaCode(areaCode)
    // It's safe to approve changes because the user must have interacted with
    // context bar.
    setChangesPrevented(false)
  }, [])

  // Clear focused area when it's outside of the hierarchy.
  useEffect(() => {
    if (
      focusedAreaCode != null &&
      areas?.some(area => area.code === focusedAreaCode) === false
    ) {
      setFocusedAreaCode(undefined)
    }
  }, [areas, focusedAreaCode, setFocusedAreaCode])

  const area =
    focusedAreaCode != null
      ? areas?.find(area => area.code === focusedAreaCode) ?? areas?.[0]
      : areas?.[0]

  const query = useMunicipalityDatasetsQuery({
    variables:
      area != null
        ? {
            municipalityCode: area.code,
            excludeTypes: [
              PlateauDatasetType.UseCase,
              PlateauDatasetType.Generic
            ]
          }
        : undefined,
    skip: area == null
  })

  const datasetGroups = useMemo(() => {
    const datasets = query.data?.municipality?.datasets
    if (datasets == null) {
      return
    }
    const groups = Object.entries(groupBy(datasets, 'type'))
    return datasetTypeOrder
      .map(orderedType => groups.find(([type]) => type === orderedType))
      .filter(isNotNullish)
      .map(([, datasets]) => datasets)
  }, [query.data])

  const [state, setState] = useState({
    areas: areas ?? undefined,
    datasetGroups
  })

  useEffect(() => {
    if (query.loading || changesPrevented) {
      return
    }
    setState({
      areas: areas ?? undefined,
      datasetGroups
    })
  }, [areas, query.loading, datasetGroups, changesPrevented])

  return {
    ...state,
    focusedAreaCode: focusedAreaCode ?? undefined,
    focusArea,
    preventChanges,
    approveChanges
  }
}
