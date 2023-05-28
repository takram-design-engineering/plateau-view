import { useAtom, useSetAtom } from 'jotai'
import { type ComponentType, type FC } from 'react'

import { type PlateauTilesetProps } from '@takram/plateau-datasets'
import { type PlateauDatasetFormat } from '@takram/plateau-graphql'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'
import { type DatasetDatum } from './useDatasetDatum'

export interface PlateauTilesetLayerContentProps
  extends Pick<
    PlateauTilesetLayerModel,
    'featureIndexAtom' | 'hiddenFeaturesAtom'
  > {
  layerId: string
  datum: DatasetDatum<PlateauDatasetFormat.Cesium3DTiles>
  component: ComponentType<PlateauTilesetProps>
}

export const PlateauTilesetLayerContent: FC<
  PlateauTilesetLayerContentProps
> = ({ layerId, datum, component, featureIndexAtom, hiddenFeaturesAtom }) => {
  const setFeatureIndex = useSetAtom(featureIndexAtom)
  const [hiddenFeatures] = useAtom(hiddenFeaturesAtom)

  const Component = component
  return (
    <Component
      featureIndexRef={setFeatureIndex}
      url={datum.url}
      hiddenFeatures={hiddenFeatures ?? undefined}
    />
  )
}
