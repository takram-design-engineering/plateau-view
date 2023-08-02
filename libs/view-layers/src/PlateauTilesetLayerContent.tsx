import { type Cesium3DTileset } from '@cesium/engine'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type RefAttributes
} from 'react'

import {
  type PlateauTilesetProps,
  type QualitativeColorSet
} from '@takram/plateau-datasets'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { type PlateauTilesetLayerModel } from './createPlateauTilesetLayerBase'
import { useEvaluateTileFeatureColor } from './useEvaluateTileFeatureColor'

export interface QualitativeProperty {
  testProperty: (name: string, value: unknown) => boolean
  colorSet: QualitativeColorSet
}

export type PlateauTilesetLayerContentProps<
  Props extends PlateauTilesetProps & RefAttributes<Cesium3DTileset>
> = Pick<
  PlateauTilesetLayerModel,
  | 'boundingSphereAtom'
  | 'featureIndexAtom'
  | 'hiddenFeaturesAtom'
  | 'propertiesAtom'
  | 'colorPropertyAtom'
  | 'colorSchemeAtom'
  | 'colorRangeAtom'
  | 'opacityAtom'
> &
  Props & {
    url: string
    component: ComponentType<Props>
    qualitativeProperties?: readonly QualitativeProperty[]
  }

export function PlateauTilesetLayerContent<
  Props extends PlateauTilesetProps & RefAttributes<Cesium3DTileset>
>({
  url,
  component,
  qualitativeProperties,
  boundingSphereAtom,
  featureIndexAtom,
  hiddenFeaturesAtom,
  propertiesAtom,
  colorPropertyAtom,
  colorSchemeAtom,
  colorRangeAtom,
  opacityAtom,
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
          const qualitativeProperty = qualitativeProperties?.find(
            ({ testProperty }) => testProperty(name, value)
          )
          if (qualitativeProperty != null) {
            return {
              name,
              type: 'qualitative' as const,
              colorSet: qualitativeProperty.colorSet
            }
          }
          if (
            'minimum' in value &&
            'maximum' in value &&
            typeof value.minimum === 'number' &&
            typeof value.maximum === 'number'
          ) {
            return {
              name,
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
  }, [qualitativeProperties, tileset, setBoundingSphere, setProperties])

  const colorProperty = useAtomValue(colorPropertyAtom)
  const colorScheme = useAtomValue(colorSchemeAtom)
  const colorRange = useAtomValue(colorRangeAtom)
  const colorSet = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const properties = get(propertiesAtom)
          const colorProperty = get(colorPropertyAtom)
          if (colorProperty == null) {
            return undefined
          }
          const property = properties?.find(
            property => property.name === colorProperty
          )
          return property?.type === 'qualitative'
            ? property.colorSet
            : undefined
        }),
      [propertiesAtom, colorPropertyAtom]
    )
  )

  const color = useEvaluateTileFeatureColor({
    colorProperty: colorProperty ?? undefined,
    colorScheme,
    colorRange,
    colorSet
  })

  const opacity = useAtomValue(opacityAtom)

  const Component = component as ComponentType<
    PlateauTilesetProps & RefAttributes<Cesium3DTileset>
  >
  return (
    <Component
      ref={setTileset}
      featureIndexRef={setFeatureIndex}
      url={url}
      hiddenFeatures={hiddenFeatures ?? undefined}
      color={color}
      opacity={opacity}
      {...props}
    />
  )
}
