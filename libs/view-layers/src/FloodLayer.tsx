import { useTheme } from '@mui/material'
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
import { FLOOD_LAYER } from './layerTypes'
import { useDatum } from './useDatum'

export interface FloodLayerModelParams extends DatasetLayerModelParams {}

export interface FloodLayerModel extends DatasetLayerModel {}

export function createFloodLayer(
  params: FloodLayerModelParams
): SetOptional<FloodLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: FLOOD_LAYER
  }
}

export const FloodLayer: FC<LayerProps<typeof FLOOD_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Flood]
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

  const datum = useDatum(datumIdAtom, query.data?.municipality?.datasets)
  const theme = useTheme()
  if (hidden || datum == null) {
    return null
  }
  return (
    <PlateauTileset
      url={datum.url}
      color={theme.palette.primary.main}
      opacity={0.5}
      disableShadow
    />
  )
}
