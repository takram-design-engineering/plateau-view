import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauWaterSurfaceTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createDatasetLayerModel,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerModel'
import {
  createPlateauTilesetLayerState,
  type PlateauTilesetLayerState,
  type PlateauTilesetLayerStateParams
} from './createPlateauTilesetLayerState'
import { RIVER_FLOODING_RISK_LAYER } from './layerTypes'
import { PlateauTilesetLayerContent } from './PlateauTilesetLayerContent'
import { type ConfigurableLayerModel } from './types'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface RiverFloodingRiskLayerModelParams
  extends DatasetLayerModelParams,
    PlateauTilesetLayerStateParams {}

export interface RiverFloodingRiskLayerModel
  extends DatasetLayerModel,
    PlateauTilesetLayerState {}

export function createRiverFloodingRiskLayer(
  params: RiverFloodingRiskLayerModelParams
): ConfigurableLayerModel<RiverFloodingRiskLayerModel> {
  return {
    ...createDatasetLayerModel(params),
    ...createPlateauTilesetLayerState(params),
    type: RIVER_FLOODING_RISK_LAYER,
    opacityAtom: atom(0.5)
  }
}

export const RiverFloodingRiskLayer: FC<
  LayerProps<typeof RIVER_FLOODING_RISK_LAYER>
> = ({
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
  opacityAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.RiverFloodingRisk]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: RIVER_FLOODING_RISK_LAYER,
    municipality,
    datum
  })
  const setTitle = useSetAtom(titleAtom)
  useEffect(() => {
    setTitle(title ?? null)
  }, [title, setTitle])

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

  if (hidden || datum == null) {
    return null
  }
  if (datum.format === PlateauDatasetFormat.Cesium3DTiles) {
    return (
      <PlateauTilesetLayerContent
        url={datum.url}
        component={PlateauWaterSurfaceTileset}
        boundingSphereAtom={boundingSphereAtom}
        featureIndexAtom={featureIndexAtom}
        hiddenFeaturesAtom={hiddenFeaturesAtom}
        propertiesAtom={propertiesAtom}
        colorPropertyAtom={colorPropertyAtom}
        colorSchemeAtom={colorSchemeAtom}
        opacityAtom={opacityAtom}
      />
    )
  }
  return null
}
