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

import {
  createDatasetLayerBase,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerBase'
import { LAND_SLIDE_RISK_LAYER } from './layerTypes'
import { MVTLayerContent } from './MVTLayerContent'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface LandSlideRiskLayerModelParams
  extends DatasetLayerModelParams {}

export interface LandSlideRiskLayerModel extends DatasetLayerModel {}

export function createLandSlideRiskLayer(
  params: LandSlideRiskLayerModelParams
): SetOptional<LandSlideRiskLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase(params),
    type: LAND_SLIDE_RISK_LAYER
  }
}

export const LandSlideRiskLayer: FC<
  LayerProps<typeof LAND_SLIDE_RISK_LAYER>
> = ({
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  municipalityCode,
  datumIdAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.LandSlideRisk]
    }
  })
  const municipality = query.data?.municipality
  const datum = useDatasetDatum(datumIdAtom, municipality?.datasets)

  const title = useDatasetLayerTitle({
    layerType: LAND_SLIDE_RISK_LAYER,
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
// https://www.mlit.go.jp/plateaudocument/#toc4_09_04
const values = [
  '1', // 土砂災害警戒区域（指定済）
  '2', // 土砂災害特別警戒区域（指定済）
  '3', // 土砂災害警戒区域（指定前）
  '4' // 土砂災害特別警戒区域（指定前）
]

// TODO: Make configurable.
const styles = values.map((value, index) => ({
  filter: ['all', ['==', 'urf:areaType_code', value]],
  type: 'fill',
  paint: {
    'fill-color': schemeCategory10[index % schemeCategory10.length]
  }
}))
