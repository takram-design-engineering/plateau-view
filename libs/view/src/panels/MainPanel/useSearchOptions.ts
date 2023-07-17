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
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { layersAtom, type LayerModel } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { isNotNullish } from '@takram/plateau-type-helpers'
import { type SearchOption } from '@takram/plateau-ui-components'
import { BUILDING_LAYER } from '@takram/plateau-view-layers'

import { areasAtom } from '../../states/address'

export interface DatasetSearchOption extends SearchOption {
  type: 'dataset'
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
  const setScreenSpaceSelection = useSetAtom(screenSpaceSelectionAtom)
  const select = useCallback(
    (option: SearchOption) => {
      if (scene == null) {
        return
      }
      switch (option.type) {
        case 'building': {
          const building = option as BuildingSearchOption
          let boundingSphere = computePlateauBoundingSphere([building.feature])
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
                building.longitude,
                building.latitude,
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
                featureIndex: building.featureIndex,
                key: building.key
              }
            }
          ])
          break
        }
      }
    },
    [scene, setScreenSpaceSelection]
  )

  return {
    datasets,
    buildings,
    addresses: [],
    select
  }
}
