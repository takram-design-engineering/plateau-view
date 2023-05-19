import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@plateau/cesium'
import { PlateauTileset } from '@plateau/datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@plateau/graphql'
import { type LayerModel, type LayerProps } from '@plateau/layers'

import { createViewLayer, type ViewLayerModelParams } from './createViewLayer'

export const BRIDGE_LAYER = 'BRIDGE_LAYER'

export interface BridgeLayerModelParams extends ViewLayerModelParams {}

export interface BridgeLayerModel extends LayerModel {}

export function createBridgeLayer(
  params: BridgeLayerModelParams
): SetOptional<BridgeLayerModel, 'id'> {
  return {
    ...createViewLayer(params),
    type: BRIDGE_LAYER,
    municipalityCode: params.municipalityCode
  }
}

export const BridgeLayer: FC<LayerProps<typeof BRIDGE_LAYER>> = ({
  layerAtom
}) => {
  const { titleAtom, hiddenAtom, municipalityCode } = useAtomValue(layerAtom)

  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Bridge]
    }
  })

  const setTitle = useSetAtom(titleAtom)
  useEffect(() => {
    if (query.data?.municipality?.name != null) {
      setTitle(
        [
          query.data.municipality.prefecture.name,
          query.data.municipality.name
        ].join(' ')
      )
    }
  }, [query, setTitle])

  const variant = query.data?.municipality?.datasets[0]?.variants[0]

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

  if (hidden || variant == null) {
    return null
  }
  return <PlateauTileset url={variant.url} />
}
