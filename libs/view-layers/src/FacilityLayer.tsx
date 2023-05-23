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
import { FACILITY_LAYER } from './layerTypes'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'
import { useMVTMetadata } from './useMVTMetadata'

export interface FacilityLayerModelParams extends DatasetLayerModelParams {}

export interface FacilityLayerModel extends DatasetLayerModel {}

export function createFacilityLayer(
  params: FacilityLayerModelParams
): SetOptional<FacilityLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: FACILITY_LAYER
  }
}

// TODO: Abstraction of MVT
export const FacilityLayer: FC<LayerProps<typeof FACILITY_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Facility]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: FACILITY_LAYER,
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
          filter: ['all', ['==', 'function', value]],
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
const values = [
  '第1種低層住居専用地域',
  '第2種低層住居専用地域',
  '第1種中高層住居専用地域',
  '第2種中高層住居専用地域',
  '第1種住居地域',
  '第2種住居地域',
  '準住居地域',
  '近隣商業地域',
  '商業地域',
  '準工業地域',
  '工業地域',
  '工業専用地域',
  '高度地区',
  '防火地域',
  '準防火地域'
]
