import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { PlateauTileset } from '@plateau/datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset
} from '@plateau/graphql'
import { type LayerModel, type LayerProps } from '@plateau/layers'

export const BUILDING_LAYER = 'BUILDING_LAYER'

export interface BuildingLayerModel extends LayerModel {
  municipalityCode: string
  version?: string
  lod?: number
  textured?: boolean
}

export const BuildingLayer: FC<LayerProps<typeof BUILDING_LAYER>> = ({
  layerAtom
}) => {
  const { municipalityCode, version, lod, textured } = useAtomValue(layerAtom)
  const query = useMunicipalityDatasetsQuery({
    variables: {
      municipalityCode,
      includeTypes: [PlateauDatasetType.Building]
    }
  })

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

  if (url == null) {
    return null
  }
  return <PlateauTileset url={url} />
}
