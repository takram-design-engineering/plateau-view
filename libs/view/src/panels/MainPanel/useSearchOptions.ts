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
  useMunicipalityDatasetsQuery,
  type PlateauDatasetFragment,
  type PlateauMunicipalityFragment
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

import { datasetTypeLayers } from '../../constants/datasetTypeLayers'
import { areasAtom } from '../../states/address'

export interface DatasetSearchOption extends SearchOption {
  type: 'dataset'
  municipality: PlateauMunicipalityFragment
  dataset: PlateauDatasetFragment
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

export interface SearchOptions {
  datasets: readonly DatasetSearchOption[]
  buildings: readonly BuildingSearchOption[]
  addresses: readonly AddressSearchOption[]
  select: (option: SearchOption) => void
}

export function useSearchOptions(): SearchOptions {
  const areas = useAtomValue(areasAtom)
  const area = areas != null ? areas[0] : areas

  const layers = useAtomValue(layersAtom)
  const findLayer = useFindLayer()

  const query = useMunicipalityDatasetsQuery({
    variables:
      area != null
        ? {
            municipalityCode: area.code,
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
    skip: area == null
  })

  const datasets = useMemo(() => {
    const municipality = query.data?.municipality
    if (municipality == null) {
      return []
    }
    return municipality.datasets
      .filter(dataset => {
        const layerType = datasetTypeLayers[dataset.type]
        return (
          layerType == null ||
          findLayer(layers, {
            type: layerType,
            municipalityCode: municipality.code
          }) == null
        )
      })
      .map(dataset => ({
        type: 'dataset' as const,
        name: dataset.typeName,
        municipality,
        dataset
      }))
  }, [query, layers, findLayer])

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

  const buildings = useMemo(
    () =>
      featureIndices.flatMap(featureIndex =>
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
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [featureIndices, featureIndicesKey]
  )

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
          if (type == null) {
            return
          }
          if (type === BUILDING_LAYER) {
            addLayer(
              createViewLayer({
                type,
                municipalityCode: datasetOption.municipality.code
              })
            )
          } else {
            addLayer(
              createViewLayer({
                type,
                municipalityCode: datasetOption.municipality.code,
                datasetId: datasetOption.dataset.id
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
