import { useAtomValue, useSetAtom } from 'jotai'
import { useContext, useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { VectorImageryLayer } from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerModel, type LayerProps } from '@takram/plateau-layers'

import { ViewLayersContext } from './ViewLayersContext'
import { createViewLayer, type ViewLayerModelParams } from './createViewLayer'
import { useMVTMetadata } from './useMVTMetadata'

export const ROAD_LAYER = 'ROAD_LAYER'

export interface RoadLayerModelParams extends ViewLayerModelParams {}

export interface RoadLayerModel extends LayerModel {}

export function createRoadLayer(
  params: RoadLayerModelParams
): SetOptional<RoadLayerModel, 'id'> {
  return {
    ...createViewLayer(params),
    type: ROAD_LAYER,
    municipalityCode: params.municipalityCode
  }
}

// TODO: Abstraction of MVT
export const RoadLayer: FC<LayerProps<typeof ROAD_LAYER>> = ({
  municipalityCode,
  titleAtom,
  hiddenAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Road]
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
  const metadata = useMVTMetadata(variant?.url)

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

  if (hidden || variant == null || metadata == null) {
    return null
  }
  return (
    <VectorImageryLayer
      url={variant.url}
      style={style}
      pixelRatio={pixelRatio}
      rectangle={metadata.rectangle}
      maximumDataZoom={metadata.maximumZoom}
    />
  )
}
