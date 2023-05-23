import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { BRIDGE_LAYER } from './layerTypes'
import { useDatasetDatum } from './useDatasetDatum'
import { useMunicipalityName } from './useMunicipalityName'

export interface BridgeLayerModelParams extends DatasetLayerModelParams {}

export interface BridgeLayerModel extends DatasetLayerModel {}

export function createBridgeLayer(
  params: BridgeLayerModelParams
): SetOptional<BridgeLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: BRIDGE_LAYER
  }
}

export const BridgeLayer: FC<LayerProps<typeof BRIDGE_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Bridge]
    }
  })
  const municipality = query.data?.municipality
  const municipalityName = useMunicipalityName(municipality)
  const setTitle = useSetAtom(titleAtom)
  useEffect(() => {
    setTitle(municipalityName ?? null)
  }, [municipalityName, setTitle])

  const hidden = useAtomValue(hiddenAtom)
  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  useEffect(() => {
    return () => {
      if (!scene.isDestroyed()) {
        scene.requestRender()
      }
    }
  }, [scene])

  const datum = useDatasetDatum(datumIdAtom, query.data?.municipality?.datasets)
  if (hidden || datum == null) {
    return null
  }
  return <PlateauTileset url={datum.url} />
}
