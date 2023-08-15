import { BoundingSphere, Cartesian3 } from '@cesium/engine'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToBoundingSphere } from '@takram/plateau-cesium-helpers'
import {
  computePlateauBoundingSphere,
  type SearchableFeatureRecord,
  type TileFeatureIndex
} from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useDatasetsQuery,
  type DatasetsQuery
} from '@takram/plateau-graphql'
import {
  addLayerAtom,
  layersAtom,
  useFindLayer,
  type LayerModel
} from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { isNotNullish } from '@takram/plateau-type-helpers'
import { type SearchOption } from '@takram/plateau-ui-components'
import { BUILDING_LAYER, createViewLayer } from '@takram/plateau-view-layers'

import { datasetTypeLayers } from '../constants/datasetTypeLayers'
import { areasAtom } from '../states/address'

export interface DatasetSearchOption extends SearchOption {
  type: 'dataset'
  dataset: DatasetsQuery['datasets'][number]
}

export interface BuildingSearchOption
  extends SearchOption,
    SearchableFeatureRecord {
  type: 'building'
  featureIndex: TileFeatureIndex
}

export interface AddressSearchOption extends SearchOption {
  type: 'address'
}

export interface SearchOptionsParams {
  skip?: boolean
}

function useDatasetSearchOptions({
  skip = false
}: SearchOptionsParams = {}): readonly DatasetSearchOption[] {
  const areas = useAtomValue(areasAtom)
  const municipalityCodes = useMemo(
    () =>
      areas
        ?.filter(area => area.type === 'municipality')
        .map(area => area.code) ?? [],
    [areas]
  )
  const query = useDatasetsQuery({
    variables:
      municipalityCodes.length > 0
        ? {
            municipalityCodes,
            includeTypes: [
              // TODO: Update supported dataset types.
              PlateauDatasetType.Bridge,
              PlateauDatasetType.Building,
              PlateauDatasetType.LandUse,
              PlateauDatasetType.LandSlideRisk,
              PlateauDatasetType.RiverFloodingRisk,
              PlateauDatasetType.Road,
              PlateauDatasetType.UrbanPlanning
            ]
          }
        : undefined,
    skip: skip || municipalityCodes.length === 0
  })

  const layers = useAtomValue(layersAtom)
  const findLayer = useFindLayer()

  return useMemo(() => {
    if (skip) {
      return []
    }
    return (
      query.data?.datasets
        .filter(dataset => {
          if (dataset.municipality == null) {
            return undefined
          }
          const layerType = datasetTypeLayers[dataset.type]
          return (
            layerType == null ||
            findLayer(layers, {
              type: layerType,
              municipalityCode: dataset.municipality.code,
              datasetId: dataset.id
            }) == null
          )
        })
        .map(dataset => ({
          type: 'dataset' as const,
          name: dataset.name !== '' ? dataset.name : dataset.typeName,
          dataset
        })) ?? []
    )
  }, [skip, query, layers, findLayer])
}

function useBuildingSearchOption({
  skip = false
}: SearchOptionsParams = {}): readonly BuildingSearchOption[] {
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
  const [featureIndicesKey, setFeatureIndicesKey] = useState(0)
  useEffect(() => {
    const removeListeners = featureIndices.map(featureIndex =>
      featureIndex.onUpdate.addEventListener(() => {
        setFeatureIndicesKey(value => value + 1)
      })
    )
    return () => {
      removeListeners.forEach(removeListener => {
        removeListener()
      })
    }
  }, [featureIndices])

  return useMemo(
    () => {
      if (skip) {
        return []
      }
      return featureIndices.flatMap(featureIndex =>
        featureIndex.searchableFeatures.map(
          ({ key, name, feature, longitude, latitude }) => ({
            type: 'building' as const,
            name,
            feature,
            featureIndex,
            key,
            longitude,
            latitude
          })
        )
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skip, featureIndices, featureIndicesKey]
  )
}

export interface SearchOptions {
  datasets: readonly DatasetSearchOption[]
  buildings: readonly BuildingSearchOption[]
  addresses: readonly AddressSearchOption[]
  select: (option: SearchOption) => void
}

export function useSearchOptions(options?: SearchOptionsParams): SearchOptions {
  const datasets = useDatasetSearchOptions(options)
  const buildings = useBuildingSearchOption(options)

  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const addLayer = useSetAtom(addLayerAtom)
  const setScreenSpaceSelection = useSetAtom(screenSpaceSelectionAtom)
  const select = useCallback(
    (option: SearchOption) => {
      if (scene == null) {
        return
      }
      switch (option.type) {
        case 'dataset': {
          const datasetOption = option as DatasetSearchOption
          const type = datasetTypeLayers[datasetOption.dataset.type]
          const municipality = datasetOption.dataset.municipality
          if (type == null || municipality == null) {
            return
          }
          if (type === BUILDING_LAYER) {
            addLayer(
              createViewLayer({
                type,
                municipalityCode: municipality.code
              })
            )
          } else {
            addLayer(
              createViewLayer({
                type,
                municipalityCode: municipality.code,
                datasetId: datasetOption.dataset.id,
                datumId: datasetOption.dataset.data[0].id
              })
            )
          }
          break
        }
        case 'building': {
          const buildingOption = option as BuildingSearchOption
          let boundingSphere = computePlateauBoundingSphere([
            buildingOption.feature
          ])
          const minRadius = 200 // Arbitrary size
          if (boundingSphere != null) {
            boundingSphere.radius = Math.max(
              minRadius,
              boundingSphere.radius * 2
            )
          } else {
            // Fallback
            boundingSphere = new BoundingSphere(
              Cartesian3.fromDegrees(
                buildingOption.longitude,
                buildingOption.latitude,
                0,
                scene.globe.ellipsoid
              ),
              minRadius
            )
          }
          void flyToBoundingSphere(scene, boundingSphere)
          setScreenSpaceSelection([
            {
              type: 'PLATEAU_TILE_FEATURE',
              value: {
                featureIndex: buildingOption.featureIndex,
                key: buildingOption.key
              }
            }
          ])
          break
        }
      }
    },
    [scene, addLayer, setScreenSpaceSelection]
  )

  return {
    datasets,
    buildings,
    addresses: [],
    select
  }
}
