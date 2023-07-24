import { Divider, Stack, styled, Typography } from '@mui/material'
import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { intersectionBy, uniq, uniqWith } from 'lodash'
import { useLayoutEffect, useMemo, type FC } from 'react'

import { type ColorScheme } from '@takram/plateau-color-schemes'
import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse, isNotNullish } from '@takram/plateau-type-helpers'
import {
  ColorSchemeParameterItem,
  GroupedParameterItem,
  InspectorItem,
  ParameterList,
  QuantitativeColorLegend,
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

const LegendRoot = styled(Stack)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
}))

const Legend: FC<{
  colorPropertyAtoms: Array<PrimitiveAtom<string | null>>
  colorSchemeAtoms: Array<PrimitiveAtom<ColorScheme>>
  colorRangeAtoms: Array<PrimitiveAtom<number[]>>
}> = ({ colorPropertyAtoms, colorSchemeAtoms, colorRangeAtoms }) => {
  const colorProperty = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorProperties = uniq(
            colorPropertyAtoms.map(colorPropertyAtom => get(colorPropertyAtom))
          )
          return colorProperties.length === 1 && colorProperties[0] != null
            ? colorProperties[0]
            : undefined
        }),
      [colorPropertyAtoms]
    )
  )
  const colorScheme = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorSchemes = uniq(
            colorSchemeAtoms.map(colorSchemeAtom => get(colorSchemeAtom))
          )
          return colorSchemes.length === 1 ? colorSchemes[0] : undefined
        }),
      [colorSchemeAtoms]
    )
  )
  const colorRange = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorRanges = uniqWith(
            colorRangeAtoms.map(colorRangeAtom => get(colorRangeAtom)),
            (a, b) => a[0] === b[0] && a[1] === b[1]
          )
          return colorRanges.length === 1 ? colorRanges[0] : undefined
        }),
      [colorRangeAtoms]
    )
  )

  if (colorProperty == null || colorScheme == null || colorRange == null) {
    return null
  }
  return (
    <LegendRoot spacing={1}>
      <Typography variant='body2'>
        {colorProperty.replaceAll('_', ' ')}
      </Typography>
      <QuantitativeColorLegend
        colorScheme={colorScheme}
        min={colorRange[0]}
        max={colorRange[1]}
      />
    </LegendRoot>
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
          <Legend
            colorPropertyAtoms={colorPropertyAtoms}
            colorSchemeAtoms={colorSchemeAtoms}
            colorRangeAtoms={colorRangeAtoms}
          />
        </ParameterList>
      </InspectorItem>
    </>
  )
}
