import { type Cesium3DTileset } from '@cesium/engine'
import { useAtom, useSetAtom } from 'jotai'
import {
  useEffect,
  useState,
  type ComponentType,
  type RefAttributes
} from 'react'

import { type PlateauTilesetProps } from '@takram/plateau-datasets'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'

export type PlateauTilesetLayerContentProps<
  Props extends PlateauTilesetProps & RefAttributes<Cesium3DTileset>
> = Pick<
  PlateauTilesetLayerModel,
  'boundingSphereAtom' | 'featureIndexAtom' | 'hiddenFeaturesAtom'
> &
  Props & {
    url: string
    component: ComponentType<Props>
  }

export function PlateauTilesetLayerContent<
  Props extends PlateauTilesetProps & RefAttributes<Cesium3DTileset>
>({
  url,
  component,
  boundingSphereAtom,
  featureIndexAtom,
  hiddenFeaturesAtom,
  ...props
}: PlateauTilesetLayerContentProps<Props>): JSX.Element {
  const setFeatureIndex = useSetAtom(featureIndexAtom)
  const [hiddenFeatures] = useAtom(hiddenFeaturesAtom)

  const [tileset, setTileset] = useState<Cesium3DTileset | null>(null)
  const setBoundingSphere = useSetAtom(boundingSphereAtom)
  useEffect(() => {
    setBoundingSphere(tileset?.boundingSphere ?? null)
  }, [tileset, setBoundingSphere])

  const Component = component as ComponentType<
    PlateauTilesetProps & RefAttributes<Cesium3DTileset>
  >
  return (
    <Component
      ref={setTileset}
      featureIndexRef={setFeatureIndex}
      url={url}
      hiddenFeatures={hiddenFeatures ?? undefined}
      {...props}
    />
  )
}
