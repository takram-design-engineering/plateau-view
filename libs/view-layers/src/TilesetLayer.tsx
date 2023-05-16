import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { PlateauTileset } from '@plateau/datasets'
import {
  PlateauDatasetType,
  useMunicipalityDatasetsQuery,
  type PlateauBuildingDataset
} from '@plateau/graphql'
import { type LayerModel, type LayerProps } from '@plateau/layers'

export const TILESET_LAYER = 'TILESET_LAYER'

export interface TilesetLayerModel extends LayerModel {
  municipalityCode: string
  version?: string
  lod?: number
  textured?: boolean
}

export const TilesetLayer: FC<LayerProps<typeof TILESET_LAYER>> = ({
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
