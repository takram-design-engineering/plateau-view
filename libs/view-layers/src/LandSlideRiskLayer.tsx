import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import {
  landSlideRiskColorSet,
  type QualitativeColorSet
} from '@takram/plateau-datasets'
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
  extends Omit<DatasetLayerModelParams, 'colorScheme'> {}

export interface LandSlideRiskLayerModel extends DatasetLayerModel {
  colorSet: QualitativeColorSet
}

export function createLandSlideRiskLayer(
  params: LandSlideRiskLayerModelParams
): SetOptional<LandSlideRiskLayerModel, 'id'> {
  return {
    ...createDatasetLayerBase({
      ...params,
      colorScheme: landSlideRiskColorSet
    }),
    type: LAND_SLIDE_RISK_LAYER,
    colorSet: landSlideRiskColorSet
  }
}

export const LandSlideRiskLayer: FC<
  LayerProps<typeof LAND_SLIDE_RISK_LAYER>
> = ({
  handleRef,
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  municipalityCode,
  datumIdAtom,
  colorSet
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

  const styles = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          get(colorSet.colorsAtom).map(({ value, color }) => ({
            filter: ['all', ['==', 'urf:areaType_code', value]],
            type: 'fill',
            paint: {
              'fill-color': color
            }
          }))
        ),
      [colorSet]
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
        handleRef={handleRef}
      />
    )
  }
  return null
}
