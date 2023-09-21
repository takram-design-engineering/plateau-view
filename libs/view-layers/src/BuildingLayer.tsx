import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type PrimitiveAtom
} from 'jotai'
import { useEffect, useMemo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauBuildingTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetFormat,
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset,
  type PlateauBuildingDatasetDatum
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createPlateauTilesetLayerState,
  type PlateauTilesetLayerState,
  type PlateauTilesetLayerStateParams
} from './createPlateauTilesetLayerState'
import {
  createViewLayerModel,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerModel'
import { BUILDING_LAYER } from './layerTypes'
import { PlateauTilesetLayerContent } from './PlateauTilesetLayerContent'
import { type ConfigurableLayerModel } from './types'
import { useMunicipalityName } from './useMunicipalityName'

export interface BuildingLayerModelParams
  extends ViewLayerModelParams,
    PlateauTilesetLayerStateParams {
  municipalityCode: string
  version?: string
  lod?: number
  textured?: boolean
}

export interface BuildingLayerModel
  extends ViewLayerModel,
    PlateauTilesetLayerState {
  municipalityCode: string
  versionAtom: PrimitiveAtom<string | null>
  lodAtom: PrimitiveAtom<number | null>
  texturedAtom: PrimitiveAtom<boolean | null>
  showWireframeAtom: PrimitiveAtom<boolean>
}

export function createBuildingLayer(
  params: BuildingLayerModelParams
): ConfigurableLayerModel<BuildingLayerModel> {
  return {
    ...createViewLayerModel(params),
    ...createPlateauTilesetLayerState(params),
    type: BUILDING_LAYER,
    municipalityCode: params.municipalityCode,
    versionAtom: atom(params.version ?? null),
    lodAtom: atom(params.lod ?? null),
    texturedAtom: atom(params.textured ?? null),
    showWireframeAtom: atom(false)
  }
}

function matchDatum(
  data: readonly PlateauBuildingDatasetDatum[],
  predicate: {
    version: string | null
    lod: number | null
    textured: boolean | null
  }
): PlateauBuildingDatasetDatum | undefined {
  const version = predicate.version ?? '2020'
  const lod = predicate.lod ?? 2
  const textured = predicate.textured ?? false
  const sorted = [...data].sort((a, b) =>
    a.version !== b.version
      ? a.version === version
        ? -1
        : 1
      : a.lod !== b.lod
      ? a.lod === lod
        ? -1
        : 1
      : a.textured !== b.textured
      ? a.textured === textured
        ? -1
        : 1
      : 0
  )
  return sorted[0]
}

export const BuildingLayer: FC<LayerProps<typeof BUILDING_LAYER>> = ({
  titleAtom,
  hiddenAtom,
  boundingSphereAtom,
  municipalityCode,
  versionAtom,
  lodAtom,
  texturedAtom,
  featureIndexAtom,
  hiddenFeaturesAtom,
  propertiesAtom,
  colorPropertyAtom,
  colorSchemeAtom,
  opacityAtom,
  showWireframeAtom
}) => {
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Building]
    }
  })
  const municipality = query.data?.municipality
  const municipalityName = useMunicipalityName(municipality)
  const setTitle = useSetAtom(titleAtom)
  useEffect(() => {
    setTitle(municipalityName ?? null)
  }, [municipalityName, setTitle])

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

  const [version, setVersion] = useAtom(versionAtom)
  const [lod, setLod] = useAtom(lodAtom)
  const [textured, setTextured] = useAtom(texturedAtom)
  const datum = useMemo(() => {
    const data = (
      query.data?.municipality?.datasets as PlateauBuildingDataset[] | undefined
    )?.flatMap(({ data }) => data)
    if (data == null || data.length === 0) {
      return
    }
    return matchDatum(data, {
      version,
      lod,
      textured
    })
  }, [version, lod, textured, query.data])

  useEffect(() => {
    if (datum == null) {
      return
    }
    setVersion(datum.version)
    setLod(datum.lod)
    setTextured(datum.textured)
  }, [setVersion, setLod, setTextured, datum])

  const showWireframe = useAtomValue(showWireframeAtom)

  if (hidden || datum == null) {
    return null
  }
  if (datum.format === PlateauDatasetFormat.Cesium3DTiles) {
    return (
      <PlateauTilesetLayerContent
        url={datum.url}
        component={PlateauBuildingTileset}
        boundingSphereAtom={boundingSphereAtom}
        featureIndexAtom={featureIndexAtom}
        hiddenFeaturesAtom={hiddenFeaturesAtom}
        propertiesAtom={propertiesAtom}
        colorPropertyAtom={colorPropertyAtom}
        colorSchemeAtom={colorSchemeAtom}
        opacityAtom={opacityAtom}
        showWireframe={showWireframe}
      />
    )
  }
  return null
}
