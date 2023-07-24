import { Divider, Typography } from '@mui/material'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { intersectionBy } from 'lodash'
import { useLayoutEffect, useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse, isNotNullish } from '@takram/plateau-type-helpers'
import {
  ColorSchemeParameterItem,
  GroupedParameterItem,
  InspectorItem,
  ParameterList,
  SelectParameterItem,
  SliderParameterItem
} from '@takram/plateau-ui-components'

function hasColorAtoms(values: readonly LayerModel[]): values is ReadonlyArray<
  Extract<
    LayerModel,
    {
      propertiesAtom: unknown
      colorPropertyAtom: unknown
      colorRangeAtom: unknown
      colorSchemeAtom: unknown
    }
  >
> {
  return values.every(
    value =>
      'propertiesAtom' in value &&
      'colorPropertyAtom' in value &&
      'colorRangeAtom' in value &&
      'colorSchemeAtom' in value
  )
}

export interface LayerColorSectionProps {
  layers: readonly LayerModel[]
}

export const LayerColorSection: FC<LayerColorSectionProps> = ({ layers }) => {
  const propertiesAtom = useMemo(
    () =>
      atom(get =>
        intersectionBy(
          ...layers.map(layer =>
            'propertiesAtom' in layer ? get(layer.propertiesAtom) ?? [] : []
          ),
          property => property.name
        )
      ),
    [layers]
  )
  const colorPropertyAtoms = useMemo(
    () =>
      layers
        .map(layer => 'colorPropertyAtom' in layer && layer.colorPropertyAtom)
        .filter(isNotFalse),
    [layers]
  )
  const colorSchemeAtoms = useMemo(
    () =>
      layers
        .map(layer => 'colorSchemeAtom' in layer && layer.colorSchemeAtom)
        .filter(isNotFalse),
    [layers]
  )
  const colorRangeAtoms = useMemo(
    () =>
      layers
        .map(layer => 'colorRangeAtom' in layer && layer.colorRangeAtom)
        .filter(isNotFalse),
    [layers]
  )

  const properties = useAtomValue(propertiesAtom)
  const propertyItems = useMemo(
    (): Array<[null, string] | [string, string]> => [
      [null, 'なし'],
      ...(properties
        .map((property): [string, string] | undefined =>
          property.type === 'number'
            ? [property.name, property.name.replaceAll('_', ' ')]
            : undefined
        )
        .filter(isNotNullish) ?? [])
    ],
    [properties]
  )

  const colorPropertyAtom = useMemo(
    () =>
      atom(get => {
        if (!hasColorAtoms(layers) || layers.length === 0) {
          return
        }
        const values = layers.map(layer => get(layer.colorPropertyAtom))
        const [value] = values
        return value != null &&
          values.slice(1).every(another => another === value)
          ? value
          : undefined
      }),
    [layers]
  )
  const colorProperty = useAtomValue(colorPropertyAtom)

  const minMax = useMemo(() => {
    if (colorProperty == null) {
      return
    }
    const property = properties.find(({ name }) => name === colorProperty)
    if (property?.type !== 'number') {
      return
    }
    return [property.minimum, property.maximum]
  }, [properties, colorProperty])

  const setColorRange = useSetAtom(
    useMemo(
      () =>
        atom(null, (get, set, value: number[]) => {
          colorRangeAtoms.forEach(colorRange => {
            set(colorRange, value)
          })
        }),
      [colorRangeAtoms]
    )
  )
  // Update color range when properties change.
  useLayoutEffect(() => {
    if (colorProperty != null && minMax != null) {
      setColorRange(minMax)
    }
  }, [colorProperty, minMax, setColorRange])

  if (!hasColorAtoms(layers)) {
    return null
  }
  return (
    <>
      <Divider light />
      <InspectorItem>
        <ParameterList>
          <GroupedParameterItem label='色分け'>
            <InspectorItem sx={{ width: 320 }}>
              <ParameterList>
                <Typography variant='subtitle1' sx={{ marginY: 1 }}>
                  色分け
                </Typography>
                <SelectParameterItem
                  label='モデル属性'
                  atom={colorPropertyAtoms}
                  items={propertyItems}
                  layout='stack'
                  displayEmpty
                />
                <ColorSchemeParameterItem
                  label='配色'
                  atom={colorSchemeAtoms}
                />
                {minMax != null && (
                  <SliderParameterItem
                    label='値範囲'
                    min={minMax[0]}
                    max={minMax[1]}
                    range
                    atom={colorRangeAtoms}
                  />
                )}
              </ParameterList>
            </InspectorItem>
          </GroupedParameterItem>
        </ParameterList>
      </InspectorItem>
    </>
  )
}
