import { schemeCategory10 } from 'd3'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import { MVTLayerContent } from './MVTLayerContent'
import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { URBAN_PLANNING_LAYER } from './layerTypes'
import { useDatasetDatum, type DatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface UrbanPlanningLayerModelParams
  extends DatasetLayerModelParams {}

export interface UrbanPlanningLayerModel extends DatasetLayerModel {}

export function createUrbanPlanningLayer(
  params: UrbanPlanningLayerModelParams
): SetOptional<UrbanPlanningLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: URBAN_PLANNING_LAYER
  }
}

export const UrbanPlanningLayer: FC<
  LayerProps<typeof URBAN_PLANNING_LAYER>
> = ({ titleAtom, hiddenAtom, municipalityCode, datumIdAtom }) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.UrbanPlanning]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: URBAN_PLANNING_LAYER,
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
  if (datum.format === PlateauDatasetFormat.Mvt) {
    return (
      <MVTLayerContent
        // TODO: Infer type
        datum={datum as DatasetDatum<PlateauDatasetFormat.Mvt>}
        styles={styles}
      />
    )
  }
  return null
}

// TODO: Separate definition.
// TODO: It's just for Common_districtAndZonesType.xml
// https://www.mlit.go.jp/plateaudocument/#toc4_10_04
const values = [
  0, // 用途地域の指定をしない区域
  1, // 第1種低層住居専用地域
  2, // 第2種低層住居専用地域
  3, // 第1種中高層住居専用地域
  4, // 第2種中高層住居専用地域
  5, // 第1種住居地域
  6, // 第2種住居地域
  7, // 準住居地域
  8, // 田園住居地域
  9, // 近隣商業地域
  10, // 商業地域
  11, // 準工業地域
  12, // 工業地域
  13, // 工業専用地域
  14, // 特別用途地区
  15, // 特定用途制限地域
  16, // 特例容積率適用地区
  17, // 高層住居誘導地区
  18, // 高度地区
  19, // 高度利用地区
  20, // 特定街区
  21, // 都市再生特別地区
  22, // 居住調整地域
  23, // 特定用途誘導地区
  24, // 防火地域
  25, // 準防火地域
  26, // 特定防災街区整備地区
  27, // 景観地区
  28, // 風致地区
  29, // 駐車場整備地区
  30, // 臨港地区
  31, // 歴史的風土特別保存地区
  32, // 第1種歴史的風土保存地区
  33, // 第2種歴史的風土保存地区
  34, // 緑地保全地域
  35, // 特別緑地保全地区
  36, // 緑化地域
  37, // 流通業務地区
  38, // 生産緑地地区
  39, // 伝統的建造物群保存地区
  40, // 航空機騒音障害防止地区
  41, // 航空機騒音障害防止特別地区
  42 // 居住環境向上用途誘導地区
]

// TODO: Make configurable.
const styles = values.map((value, index) => ({
  // TODO: I cannot find documentation about this field. Value type
  // differs from "urf:function_code" in "attributes" field.
  filter: ['all', ['==', 'function_code', value]],
  type: 'fill',
  paint: {
    'fill-color': schemeCategory10[index % schemeCategory10.length]
  }
}))
