import { useAtom, type PrimitiveAtom } from 'jotai'
import { type ComponentType, type FC } from 'react'

import { type PlateauTilesetProps } from '@takram/plateau-datasets'
import { type PlateauDatasetFormat } from '@takram/plateau-graphql'

import { type DatasetDatum } from './useDatasetDatum'

export interface PlateauTilesetLayerContentProps {
  datum: DatasetDatum<PlateauDatasetFormat.Cesium3DTiles>
  component: ComponentType<PlateauTilesetProps>
  hiddenFeaturesAtom: PrimitiveAtom<readonly string[] | null>
}

export const PlateauTilesetLayerContent: FC<
  PlateauTilesetLayerContentProps
> = ({ datum, component, hiddenFeaturesAtom }) => {
  const [hiddenFeatures] = useAtom(hiddenFeaturesAtom)

  const Component = component
  return (
    <Component url={datum.url} hiddenFeatures={hiddenFeatures ?? undefined} />
  )
}
