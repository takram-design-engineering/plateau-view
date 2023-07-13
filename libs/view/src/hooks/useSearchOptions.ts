import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type SearchOption } from '@takram/plateau-ui-components'

import { areasAtom } from '../states/address'

export function useSearchOptions(): SearchOption[] {
  const areas = useAtomValue(areasAtom)
  const area = areas != null ? areas[0] : areas

  const query = useMunicipalityDatasetsQuery({
    variables:
      area != null
        ? {
            municipalityCode: area.code,
            excludeTypes: [
              PlateauDatasetType.UseCase,
              PlateauDatasetType.GenericCityObject
            ]
          }
        : undefined,
    skip: area == null
  })

  return useMemo(
    () =>
      query.data?.municipality?.datasets.map(dataset => ({
        type: 'dataset',
        name: dataset.typeName
      })) ?? [],
    [query]
  )
}
