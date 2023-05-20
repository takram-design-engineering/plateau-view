import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerModel, type LayerProps } from '@takram/plateau-layers'

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
  municipalityCode,
  titleAtom,
  hiddenAtom
}) => {
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

  const variant = query.data?.municipality?.datasets[0]?.variants[0]
  if (hidden || variant == null) {
    return null
  }
  return <PlateauTileset url={variant.url} />
}
