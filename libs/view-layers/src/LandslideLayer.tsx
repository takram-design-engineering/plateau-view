import { schemeCategory10 } from 'd3'
import { useAtomValue, useSetAtom } from 'jotai'
import { useContext, useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@plateau/cesium'
import { VectorImageryLayer } from '@plateau/datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@plateau/graphql'
import { type LayerModel, type LayerProps } from '@plateau/layers'

import { ViewLayersContext } from './ViewLayersContext'
import { createViewLayer, type ViewLayerModelParams } from './createViewLayer'
import { useMVTMetadata } from './useMVTMetadata'

export const LANDSLIDE_LAYER = 'LANDSLIDE_LAYER'

export interface LandslideLayerModelParams extends ViewLayerModelParams {}

export interface LandslideLayerModel extends LayerModel {}

export function createLandslideLayer(
  params: LandslideLayerModelParams
): SetOptional<LandslideLayerModel, 'id'> {
  return {
    ...createViewLayer(params),
    type: LANDSLIDE_LAYER,
    municipalityCode: params.municipalityCode
  }
}

// TODO: Abstraction of MVT
export const LandslideLayer: FC<LayerProps<typeof LANDSLIDE_LAYER>> = ({
  municipalityCode,
  titleAtom,
  hiddenAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Landslide]
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
      layers: metadata.sourceLayers.flatMap(layer =>
        values.map((value, index) => ({
          'source-layer': layer.id,
          filter: ['all', ['==', 'urf:areaType', value]],
          type: 'fill',
          paint: {
            'fill-color': schemeCategory10[index % schemeCategory10.length]
          }
        }))
      )
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

// Separate definition.
const values = ['土砂災害警戒区域（指定済）', '土砂災害特別警戒区域（指定済）']
