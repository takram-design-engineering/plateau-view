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
  type PlateauBuildingDatasetVariant
} from '@takram/plateau-graphql'
import { type LayerModel, type LayerProps } from '@takram/plateau-layers'

import {
  createViewLayerBase,
  type ViewLayerBaseModelParams
} from './createViewLayerBase'
import { BUILDING_LAYER } from './layerTypes'

export interface BuildingLayerModelParams extends ViewLayerBaseModelParams {
  version?: string
  lod?: number
  textured?: boolean
}

export interface BuildingLayerModel extends LayerModel {
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

function matchVariant(
  variants: readonly PlateauBuildingDatasetVariant[],
  predicate: {
    version: string | null
    lod: number | null
    textured: boolean | null
  }
): PlateauBuildingDatasetVariant | undefined {
  const version = predicate.version ?? '2020'
  const lod = predicate.lod ?? 2
  const textured = predicate.textured ?? false
  const sorted = [...variants].sort((a, b) =>
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
  const variant = useMemo(() => {
    const variants = (
      query.data?.municipality?.datasets as PlateauBuildingDataset[] | undefined
    )?.flatMap(({ variants }) => variants)
    if (variants == null || variants.length === 0) {
      return
    }
    return matchVariant(variants, {
      version,
      lod,
      textured
    })
  }, [version, lod, textured, query.data])

  useEffect(() => {
    setVersion(variant?.version ?? null)
    setLod(variant?.lod ?? null)
    setTextured(variant?.textured ?? null)
  }, [setVersion, setLod, setTextured, variant])

  if (hidden || variant == null) {
    return null
  }
  return <PlateauTileset url={variant.url} />
}
