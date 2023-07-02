import { type Cesium3DTileset } from '@cesium/engine'
import { useAtom, useSetAtom } from 'jotai'
import {
  useEffect,
  useState,
  type ComponentType,
  type RefAttributes
} from 'react'

import { type PlateauTilesetProps } from '@takram/plateau-datasets'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'

export type PlateauTilesetLayerContentProps<
  Props extends PlateauTilesetProps & RefAttributes<Cesium3DTileset>
> = Pick<
  PlateauTilesetLayerModel,
  | 'boundingSphereAtom'
  | 'featureIndexAtom'
  | 'hiddenFeaturesAtom'
  | 'propertiesAtom'
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
  propertiesAtom,
  ...props
}: PlateauTilesetLayerContentProps<Props>): JSX.Element {
  const setFeatureIndex = useSetAtom(featureIndexAtom)
  const [hiddenFeatures] = useAtom(hiddenFeaturesAtom)

  const [tileset, setTileset] = useState<Cesium3DTileset | null>(null)
  const setBoundingSphere = useSetAtom(boundingSphereAtom)
  const setProperties = useSetAtom(propertiesAtom)
  useEffect(() => {
    if (tileset == null) {
      setBoundingSphere(null)
      setProperties(null)
      return
    }
    setBoundingSphere(tileset.boundingSphere)
    setProperties(
      Object.entries(tileset.properties)
        .map(([name, value]) => {
          if (
            name.startsWith('_') ||
            value == null ||
            typeof value !== 'object'
          ) {
            return undefined
          }
          if (
            'minimum' in value &&
            'maximum' in value &&
            typeof value.minimum === 'number' &&
            typeof value.maximum === 'number'
          ) {
            return {
              name: name.replaceAll('_', ' '),
              type: 'number' as const,
              minimum: value.minimum,
              maximum: value.maximum
            }
          }
          return {
            name,
            type: 'unknown' as const
          }
        })
        .filter(isNotNullish)
    )
  }, [tileset, setBoundingSphere, setProperties])

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
