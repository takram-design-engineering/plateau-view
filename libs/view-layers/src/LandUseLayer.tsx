import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import {
  landUseColorSet,
  type QualitativeColorSet
} from '@takram/plateau-datasets'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createDatasetLayerModel,
  type DatasetLayerModel,
  type DatasetLayerModelParams
} from './createDatasetLayerModel'
import {
  createMVTLayerState,
  type MVTLayerState,
  type MVTLayerStateParams
} from './createMVTLayerState'
import { LAND_USE_LAYER } from './layerTypes'
import { MVTLayerContent } from './MVTLayerContent'
import { type ConfigurableLayerModel } from './types'
import { useDatasetDatum } from './useDatasetDatum'
import { useDatasetLayerTitle } from './useDatasetLayerTitle'

export interface LandUseLayerModelParams
  extends Omit<DatasetLayerModelParams, 'colorScheme'>,
    MVTLayerStateParams {}

export interface LandUseLayerModel extends DatasetLayerModel, MVTLayerState {
  colorSet: QualitativeColorSet
}

export function createLandUseLayer(
  params: LandUseLayerModelParams
): ConfigurableLayerModel<LandUseLayerModel> {
  return {
    ...createDatasetLayerModel({
      ...params,
      colorScheme: landUseColorSet
    }),
    ...createMVTLayerState(params),
    type: LAND_USE_LAYER,
    colorSet: landUseColorSet
  }
}

export const LandUseLayer: FC<LayerProps<typeof LAND_USE_LAYER>> = ({
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
        atom(get =>
          get(colorSet.colorsAtom).map(({ value, color }) => ({
            filter: ['all', ['==', 'luse:class_code', value]],
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
