import {
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
  type PrimitiveAtom
} from 'jotai'
import { useEffect, useMemo, type FC } from 'react'
import { type SetOptional } from 'type-fest'

import { useCesium } from '@takram/plateau-cesium'
import { PlateauTileset } from '@takram/plateau-datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset,
  type PlateauBuildingDatasetDatum
} from '@takram/plateau-graphql'
import { type LayerProps } from '@takram/plateau-layers'

import {
  createViewLayerBase,
  type ViewLayerModel,
  type ViewLayerModelParams
} from './createViewLayerBase'
import { BUILDING_LAYER } from './layerTypes'

export interface BuildingLayerModelParams
  extends Omit<ViewLayerModelParams, 'datumId'> {
  municipalityCode: string
  version?: string
  lod?: number
  textured?: boolean
}

export interface BuildingLayerModel extends ViewLayerModel {
  municipalityCode: string
  versionAtom: PrimitiveAtom<string | null>
  lodAtom: PrimitiveAtom<number | null>
  texturedAtom: PrimitiveAtom<boolean | null>
}

export function createBuildingLayer(
  params: BuildingLayerModelParams
): SetOptional<BuildingLayerModel, 'id'> {
  return {
    ...createViewLayerBase(params),
    type: BUILDING_LAYER,
    municipalityCode: params.municipalityCode,
    versionAtom: atom(params.version ?? null),
    lodAtom: atom(params.lod ?? null),
    texturedAtom: atom(params.textured ?? null)
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
  municipalityCode,
  versionAtom,
  lodAtom,
  texturedAtom
}) => {
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
  const data = useMemo(() => {
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
    setVersion(data?.version ?? null)
    setLod(data?.lod ?? null)
    setTextured(data?.textured ?? null)
  }, [setVersion, setLod, setTextured, data])

  if (hidden || data == null) {
    return null
  }
  return <PlateauTileset url={data.url} />
}
