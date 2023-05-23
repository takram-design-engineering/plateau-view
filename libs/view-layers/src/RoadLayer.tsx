import { useAtomValue, useSetAtom } from 'jotai'
import { useContext, useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { VectorImageryLayer } from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import { ViewLayersContext } from './ViewLayersContext'
import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { ROAD_LAYER } from './layerTypes'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'
import { useDatum } from './useDatum'
import { useMVTMetadata } from './useMVTMetadata'

export interface RoadLayerModelParams extends DatasetLayerModelParams {}

export interface RoadLayerModel extends DatasetLayerModel {}

export function createRoadLayer(
  params: RoadLayerModelParams
): SetOptional<RoadLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: ROAD_LAYER
  }
}

// TODO: Abstraction of MVT
export const RoadLayer: FC<LayerProps<typeof ROAD_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Road]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: ROAD_LAYER,
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

  const metadata = useMVTMetadata(datum?.url)
  const style = useMemo(() => {
    if (metadata == null) {
      return
    }
    // TODO: Make it configurable.
    return {
      version: 8,
      layers: metadata.sourceLayers.map(layer => ({
        'source-layer': layer.id,
        type: 'fill',
        paint: { 'fill-color': '#808080' }
      }))
    }
  }, [metadata])

  const { pixelRatioAtom } = useContext(ViewLayersContext)
  const pixelRatio = useAtomValue(pixelRatioAtom)

  if (hidden || datum == null || metadata == null) {
    return null
  }
  return (
    <VectorImageryLayer
      url={datum.url}
      style={style}
      pixelRatio={pixelRatio}
      rectangle={metadata.rectangle}
      maximumDataZoom={metadata.maximumZoom}
    />
  )
}

// TODO: Separate definition.
// TODO: Their MVT does not appear to have fields for these values.
// const values = [
//   '道路',
//   '島',
//   '交通島',
//   '分離帯',
//   '植栽',
//   '植樹帯',
//   '植樹ます',
//   '自転車歩行者道',
//   '歩道',
//   '自転車道'
// ]
