import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauBridgeTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createPlateauTilesetLayerBase,
  type PlateauTilesetLayerModel,
  type PlateauTilesetLayerModelParams
} from './createPlateauTilesetLayerBase'
import { BRIDGE_LAYER } from './layerTypes'
import { PlateauTilesetLayerContent } from './PlateauTilesetLayerContent'
import { useDatasetDatum } from './useDatasetDatum'
import { useEvaluateTileFeatureColor } from './useEvaluateTileFeatureColor'
import { useMunicipalityName } from './useMunicipalityName'

export interface BridgeLayerModelParams
  extends PlateauTilesetLayerModelParams {}

export interface BridgeLayerModel extends PlateauTilesetLayerModel {}

export function createBridgeLayer(
  params: BridgeLayerModelParams
): SetOptional<BridgeLayerModel, 'id'> {
  return {
    ...createPlateauTilesetLayerBase(params),
    type: BRIDGE_LAYER
  }
}

export const BridgeLayer: FC<LayerProps<typeof BRIDGE_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  municipalityCode,
  datumIdAtom,
  featureIndexAtom,
  hiddenFeaturesAtom,
  propertiesAtom,
  colorPropertyAtom,
  colorSchemeAtom,
  colorRangeAtom
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

  const color = useEvaluateTileFeatureColor({
    colorPropertyAtom,
    colorSchemeAtom,
    colorRangeAtom
  })

  if (hidden || datum == null) {
    return null
  }
  if (datum.format === PlateauDatasetFormat.Cesium3DTiles) {
    return (
      <PlateauTilesetLayerContent
        url={datum.url}
        component={PlateauBridgeTileset}
        boundingSphereAtom={boundingSphereAtom}
        featureIndexAtom={featureIndexAtom}
        hiddenFeaturesAtom={hiddenFeaturesAtom}
        propertiesAtom={propertiesAtom}
        color={color}
      />
    )
  }
  return null
}
