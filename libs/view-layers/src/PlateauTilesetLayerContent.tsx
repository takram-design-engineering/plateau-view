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

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'

export interface PlateauTilesetLayerContentProps
  extends Pick<
    PlateauTilesetLayerModel,
    'boundingSphereAtom' | 'featureIndexAtom' | 'hiddenFeaturesAtom'
  > {
  url: string
  component: ComponentType<PlateauTilesetProps & RefAttributes<Cesium3DTileset>>
}

export const PlateauTilesetLayerContent: FC<
  PlateauTilesetLayerContentProps
> = ({
  url,
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
      url={url}
      hiddenFeatures={hiddenFeatures ?? undefined}
    />
  )
}
