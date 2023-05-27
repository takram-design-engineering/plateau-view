import { schemeCategory10 } from 'd3'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { VectorImageryLayer } from '@takram/plateau-datasets'
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
import { LANDUSE_LAYER } from './layerTypes'
import { pixelRatioAtom } from './states'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'
import { useMVTMetadata } from './useMVTMetadata'

export interface LanduseLayerModelParams extends DatasetLayerModelParams {}

export interface LanduseLayerModel extends DatasetLayerModel {}

export function createLanduseLayer(
  params: LanduseLayerModelParams
): SetOptional<LanduseLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: LANDUSE_LAYER
  }
}

// TODO: Abstraction of MVT
export const LanduseLayer: FC<LayerProps<typeof LANDUSE_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Landuse]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: LANDUSE_LAYER,
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
          filter: ['all', ['==', 'luse:class_code', value]],
          type: 'fill',
          paint: {
            'fill-color': schemeCategory10[index % schemeCategory10.length]
          }
        }))
      )
    }
  }, [metadata])

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
// https://www.mlit.go.jp/plateaudocument/#toc4_08_04
const values = [
  '201', // 田（水田）
  '202', // 畑（畑、樹園地、採草地、養鶏（牛・豚）場）
  '203', // 山林（樹林地）
  '204', // 水面（河川水面、湖沼、ため池、用水路、濠、運河水面）
  '205', // その他自然地（原野・牧野、荒れ地、低湿地、河川敷・河原、海浜、湖岸）
  '211', // 住宅用地（住宅、共同住宅、店舗等併用住宅、店舗等併用共同住宅、作業所併用住宅）
  '212', // 商業用地
  '213', // 工業用地
  '219', // 農林漁業施設用地
  '214', // 公益施設用地
  '215', // 道路用地（道路、駅前広場）
  '216', // 交通施設用地
  '217', // 公共空地（公園・緑地、広場、運動場、墓園）
  '218', // その他公的施設用地（防衛施設用地）
  '220', // その他の空地①（ゴルフ場）
  '221', // その他空地②（太陽光発電のシステムを直接整備している土地）
  '222', // その他の空地③（平面駐車場）
  '223', // その他の空地④（その他の空地①～③以外の都市的土地利用：建物跡地、資材置場、改変工事中の土地、法面（道路、造成地等の主利用に含まれない法面））
  '231', // 不明
  '251', // 可住地
  '252', // 非可住地
  '260', // 農地（田、畑の区分がない）
  '261', // 宅地（住宅用地、商業用地等の区分が無い）
  '262', // 道路・鉄軌道敷（道路と交通施設用地が混在）
  '263' // 空地（その他の空地①～④の区分が無い）
]
