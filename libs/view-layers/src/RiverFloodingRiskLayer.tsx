import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauWaterSurfaceTileset } from '@takram/plateau-datasets'
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
import { RIVER_FLOODING_RISK_LAYER } from './layerTypes'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface RiverFloodingRiskLayerModelParams
  extends DatasetLayerModelParams {}

export interface RiverFloodingRiskLayerModel extends DatasetLayerModel {}

export function createRiverFloodingRiskLayer(
  params: RiverFloodingRiskLayerModelParams
): SetOptional<RiverFloodingRiskLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: RIVER_FLOODING_RISK_LAYER
  }
}

export const RiverFloodingRiskLayer: FC<
  LayerProps<typeof RIVER_FLOODING_RISK_LAYER>
> = ({ titleAtom, hiddenAtom, municipalityCode, datumIdAtom }) => {
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
  return <PlateauWaterSurfaceTileset url={datum.url} />
}
