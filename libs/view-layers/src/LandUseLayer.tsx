import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { type QualitativeColor } from '@takram/plateau-color-schemes'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { LAND_USE_LAYER } from './layerTypes'
import { MVTLayerContent } from './MVTLayerContent'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface LandUseLayerModelParams extends DatasetLayerModelParams {}

export interface LandUseLayerModel extends DatasetLayerModel {
  colorListAtom: PrimitiveAtom<Array<PrimitiveAtom<QualitativeColor>>>
}

export function createLandUseLayer(
  params: LandUseLayerModelParams
): SetOptional<LandUseLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: LAND_USE_LAYER,
    colorListAtom: atom<Array<PrimitiveAtom<QualitativeColor>>>(
      defaultColorList.map(item => atom<QualitativeColor>(item))
    )
  }
}

export const LandUseLayer: FC<LayerProps<typeof LAND_USE_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  municipalityCode,
  datumIdAtom,
  colorListAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.LandUse]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: LAND_USE_LAYER,
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

  const styles = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorList = get(colorListAtom).map(itemAtom => get(itemAtom))
          return colorList.map(({ value, color }) => ({
            filter: ['all', ['==', 'luse:class_code', value]],
            type: 'fill',
            paint: {
              'fill-color': color
            }
          }))
        }),
      [colorListAtom]
    )
  )

  if (hidden || datum == null) {
    return null
  }
  if (datum.format === PlateauDatasetFormat.Mvt) {
    return (
      <MVTLayerContent
        url={datum.url}
        styles={styles}
        boundingSphereAtom={boundingSphereAtom}
      />
    )
  }
  return null
}

// Colors inherited from VIEW 2.0.
// List of codes: https://www.mlit.go.jp/plateaudocument/#toc4_08_04
// prettier-ignore
const defaultColorList: readonly QualitativeColor[] = [
  { value: '201', color: '#f9f06f', name: '田（水田）' },
  { value: '202', color: '#f5bc55', name: '畑（畑、樹園地、採草地、養鶏（牛・豚）場）' },
  { value: '203', color: '#009357', name: '山林（樹林地）' },
  { value: '204', color: '#0091c5', name: '水面（河川水面、湖沼、ため池、用水路、濠、運河水面）' },
  { value: '205', color: '#c69885', name: 'その他自然地（原野・牧野、荒れ地、低湿地、河川敷・河原、海浜、湖岸）' },
  { value: '211', color: '#e8868f', name: '住宅用地（住宅、共同住宅、店舗等併用住宅、店舗等併用共同住宅、作業所併用住宅）' },
  { value: '212', color: '#df5555', name: '商業用地' },
  { value: '213', color: '#0073b0', name: '工業用地' },
  { value: '219', color: '#99ff00', name: '農林漁業施設用地' },
  { value: '214', color: '#d691b5', name: '公益施設用地' },
  { value: '215', color: '#949ab3', name: '道路用地（道路、駅前広場）' },
  { value: '216', color: '#b0a2bf', name: '交通施設用地' },
  { value: '217', color: '#00a565', name: '公共空地（公園・緑地、広場、運動場、墓園）' },
  { value: '218', color: '#6603fc', name: 'その他公的施設用地（防衛施設用地）' },
  { value: '220', color: '#77945b', name: 'その他の空地①（ゴルフ場）' },
  { value: '221', color: '#652a60', name: 'その他空地②（太陽光発電のシステムを直接整備している土地）' },
  { value: '222', color: '#5e5c60', name: 'その他の空地③（平面駐車場）' },
  { value: '223', color: '#7c745f', name: 'その他の空地④（その他の空地①～③以外の都市的土地利用：建物跡地、資材置場、改変工事中の土地、法面（道路、造成地等の主利用に含まれない法面））' },
  { value: '231', color: '#333333', name: '不明' },
  { value: '251', color: '#d7157e', name: '可住地' },
  { value: '252', color: '#dc143c', name: '非可住地' },
  { value: '260', color: '#f9f06f', name: '農地（田、畑の区分がない）' },
  { value: '261', color: '#ff5e8c', name: '宅地（住宅用地、商業用地等の区分が無い）' },
  { value: '262', color: '#cecece', name: '道路・鉄軌道敷（道路と交通施設用地が混在）' },
  { value: '263', color: '#f1c7ff', name: '空地（その他の空地①～④の区分が無い）' }
]
