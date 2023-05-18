import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@plateau/cesium'
import { PlateauTileset } from '@plateau/datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset
} from '@plateau/graphql'
import { type LayerModel, type LayerProps } from '@plateau/layers'

import { createViewLayer, type ViewLayerModelParams } from './createViewLayer'

export const BUILDING_LAYER = 'BUILDING_LAYER'

export interface BuildingLayerModelParams extends ViewLayerModelParams {
  municipalityCode: string
  version?: string
  lod?: number
  textured?: boolean
}

export interface BuildingLayerModel extends LayerModel {
  municipalityCode: string
  versionAtom: PrimitiveAtom<string | null>
  lodAtom: PrimitiveAtom<number | null>
  texturedAtom: PrimitiveAtom<boolean | null>
}

export function createBuildingLayer(
  params: BuildingLayerModelParams
): SetOptional<BuildingLayerModel, 'id'> {
  return {
    ...createViewLayer(params),
    type: BUILDING_LAYER,
    municipalityCode: params.municipalityCode,
    versionAtom: atom(params.version ?? null),
    lodAtom: atom(params.lod ?? null),
    texturedAtom: atom(params.textured ?? null)
  }
}

export const BuildingLayer: FC<LayerProps<typeof BUILDING_LAYER>> = ({
  layerAtom
}) => {
  const {
    titleAtom,
    hiddenAtom,
    municipalityCode,
    versionAtom,
    lodAtom,
    texturedAtom
  } = useAtomValue(layerAtom)

  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Building]
    }
  })

  const setTitle = useSetAtom(titleAtom)
  useEffect(() => {
    if (query.data?.municipality?.name != null) {
      setTitle(
        [
          query.data.municipality.prefecture.name,
          query.data.municipality.name
        ].join(' ')
      )
    }
  }, [query, setTitle])

  const version = useAtomValue(versionAtom)
  const lod = useAtomValue(lodAtom)
  const textured = useAtomValue(texturedAtom)
  const url = useMemo(() => {
    const variants = (
      query.data?.municipality?.datasets as PlateauBuildingDataset[] | undefined
    )?.flatMap(({ variants }) => variants)
    if (variants == null || variants.length === 0) {
      return
    }
    return variants.find(
      variant =>
        variant.version === version &&
        variant.lod === lod &&
        variant.textured === textured
    )?.url
  }, [version, lod, textured, query.data])

  const hidden = useAtomValue(hiddenAtom)
  const scene = useCesium(({ scene }) => scene)
  scene.requestRender()

  if (hidden || url == null) {
    return null
  }
  return <PlateauTileset url={url} />
}
