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

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { ROAD_LAYER } from './layerTypes'
import { MVTLayerContent } from './MVTLayerContent'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

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

export const RoadLayer: FC<LayerProps<typeof ROAD_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
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
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

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

// TODO: Separate definition.
// https://www.mlit.go.jp/plateaudocument/#toc4_03_04
// const values = [
//   '1', // 高速自動車国道
//   '2', // 一般国道
//   '3', // 都道府県道
//   '4', // 市町村道
//   '10', // 建築基準法第42条1項2号道路
//   '11', // 建築基準法第42条1項3号道路
//   '12', // 建築基準法第42条1項4号道路
//   '13', // 建築基準法第42条1項5号道路
//   '14', // 建築基準法第42条2項道路
//   '15', // 建築基準法第43条2項ただし書きの適用を受けたことがある道
//   '9000', // 未調査
//   '9010', // 対象外
//   '9020' // 不明
// ]

// TODO: Make configurable.
const styles = [
  {
    type: 'fill',
    paint: { 'fill-color': '#808080' }
  }
]
