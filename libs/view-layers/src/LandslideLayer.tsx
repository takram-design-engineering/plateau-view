import { schemeCategory10 } from 'd3'
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
import { LANDSLIDE_LAYER } from './layerTypes'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'
import { useMVTMetadata } from './useMVTMetadata'

export interface LandslideLayerModelParams extends DatasetLayerModelParams {}

export interface LandslideLayerModel extends DatasetLayerModel {}

export function createLandslideLayer(
  params: LandslideLayerModelParams
): SetOptional<LandslideLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: LANDSLIDE_LAYER
  }
}

// TODO: Abstraction of MVT
export const LandslideLayer: FC<LayerProps<typeof LANDSLIDE_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Landslide]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: LANDSLIDE_LAYER,
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
const values = ['土砂災害警戒区域（指定済）', '土砂災害特別警戒区域（指定済）']
