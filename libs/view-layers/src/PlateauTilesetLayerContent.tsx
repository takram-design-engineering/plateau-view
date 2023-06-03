import { type Cesium3DTileset } from '@cesium/engine'
import { useAtom, useSetAtom } from 'jotai'
import {
  useEffect,
  useState,
  type ComponentType,
  type FC,
  type RefAttributes
} from 'react'

import { type PlateauTilesetProps } from '@takram/plateau-datasets'
import { type PlateauDatasetFormat } from '@takram/plateau-graphql'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'
import { type DatasetDatum } from './useDatasetDatum'

export interface PlateauTilesetLayerContentProps
  extends Pick<
    PlateauTilesetLayerModel,
    'boundingSphereAtom' | 'featureIndexAtom' | 'hiddenFeaturesAtom'
  > {
  layerId: string
  datum: DatasetDatum<PlateauDatasetFormat.Cesium3DTiles>
  component: ComponentType<PlateauTilesetProps & RefAttributes<Cesium3DTileset>>
}

export const PlateauTilesetLayerContent: FC<
  PlateauTilesetLayerContentProps
> = ({
  layerId,
  datum,
  component,
  boundingSphereAtom,
  featureIndexAtom,
  hiddenFeaturesAtom
}) => {
  const setFeatureIndex = useSetAtom(featureIndexAtom)
  const [hiddenFeatures] = useAtom(hiddenFeaturesAtom)

  const [tileset, setTileset] = useState<Cesium3DTileset | null>(null)
  const setBoundingSphere = useSetAtom(boundingSphereAtom)
  useEffect(() => {
    setBoundingSphere(tileset?.boundingSphere ?? null)
  }, [tileset, setBoundingSphere])

  const Component = component
  return (
    <Component
      ref={setTileset}
      featureIndexRef={setFeatureIndex}
      url={datum.url}
      hiddenFeatures={hiddenFeatures ?? undefined}
    />
  )
}
