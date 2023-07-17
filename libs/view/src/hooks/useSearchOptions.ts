import { atom, useAtomValue } from 'jotai'
import { useMemo } from 'react'

import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { layersAtom, type LayerModel } from '@takram/plateau-layers'
import { isNotNullish } from '@takram/plateau-type-helpers'
import { type SearchOption } from '@takram/plateau-ui-components'
import { BUILDING_LAYER } from '@takram/plateau-view-layers'

import { areasAtom } from '../states/address'

export interface SearchOptions {
  datasets: ReadonlyArray<SearchOption & { type: 'dataset' }>
  buildings: ReadonlyArray<SearchOption & { type: 'building' }>
  addresses: ReadonlyArray<SearchOption & { type: 'address' }>
}

export function useSearchOptions(): SearchOptions {
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
  const datasets = useMemo(
    () =>
      query.data?.municipality?.datasets.map(dataset => ({
        type: 'dataset' as const,
        name: dataset.typeName
      })) ?? [],
    [query]
  )

  const layers = useAtomValue(layersAtom)
  const featureIndices = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          layers
            .filter(
              (layer): layer is LayerModel<typeof BUILDING_LAYER> =>
                layer.type === BUILDING_LAYER
            )
            .map(layer => get(layer.featureIndexAtom))
            .filter(isNotNullish)
        ),
      [layers]
    )
  )
  const buildings = useMemo(
    () =>
      featureIndices.flatMap(featureIndex =>
        featureIndex.features.map(({ name }) => ({
          type: 'building' as const,
          name
        }))
      ),
    [featureIndices]
  )

  return {
    datasets,
    buildings,
    addresses: []
  }
}
