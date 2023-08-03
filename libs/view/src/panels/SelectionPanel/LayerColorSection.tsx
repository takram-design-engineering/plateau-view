import { Divider, Stack, styled, Typography } from '@mui/material'
import { atom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { intersectionBy, uniq, uniqWith } from 'lodash'
import { useLayoutEffect, useMemo, type FC } from 'react'

import { type ColorMap } from '@takram/plateau-color-maps'
import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse, isNotNullish } from '@takram/plateau-type-helpers'
import {
  ColorMapParameterItem,
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
      colorMapAtom: unknown
      colorRangeAtom: unknown
    }
  >
> {
  return values.every(
    value =>
      'propertiesAtom' in value &&
      'colorPropertyAtom' in value &&
      'colorMapAtom' in value &&
      'colorRangeAtom' in value
  )
}

const LegendRoot = styled(Stack)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1)
}))

const Legend: FC<{
  colorPropertyAtoms: Array<PrimitiveAtom<string | null>>
  colorMapAtoms: Array<PrimitiveAtom<ColorMap>>
  colorRangeAtoms: Array<PrimitiveAtom<number[]>>
}> = ({ colorPropertyAtoms, colorMapAtoms, colorRangeAtoms }) => {
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
  const colorMap = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorMaps = uniq(
            colorMapAtoms.map(colorMapAtom => get(colorMapAtom))
          )
          return colorMaps.length === 1 ? colorMaps[0] : undefined
        }),
      [colorMapAtoms]
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

  if (colorProperty == null || colorMap == null || colorRange == null) {
    return null
  }
  return (
    <LegendRoot spacing={1}>
      <Typography variant='body2'>
        {colorProperty.replaceAll('_', ' ')}
      </Typography>
      <QuantitativeColorLegend
        colorMap={colorMap}
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
  const colorMapAtoms = useMemo(
    () =>
      layers
        .map(layer => 'colorMapAtom' in layer && layer.colorMapAtom)
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
          property.type === 'number' || property.type === 'qualitative'
            ? [property.name, property.name.replaceAll('_', ' ')]
            : undefined
        )
        .filter(isNotNullish) ?? [])
    ],
    [properties]
  )

  const property = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          if (!hasColorAtoms(layers) || layers.length === 0) {
            return
          }
          const properties = get(propertiesAtom)
          const values = layers.map(layer => get(layer.colorPropertyAtom))
          const value = values[0]
          return value != null &&
            values.slice(1).every(another => another === value)
            ? properties.find(({ name }) => name === value)
            : undefined
        }),
      [layers, propertiesAtom]
    )
  )

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
    if (property?.type === 'number') {
      setColorRange([property.minimum, property.maximum])
    }
  }, [property, setColorRange])

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
                {property?.type === 'number' && (
                  <>
                    <ColorMapParameterItem label='配色' atom={colorMapAtoms} />
                    <SliderParameterItem
                      label='値範囲'
                      min={property.minimum}
                      max={property.maximum}
                      range
                      atom={colorRangeAtoms}
                    />
                  </>
                )}
              </ParameterList>
            </InspectorItem>
          </GroupedParameterItem>
          <Legend
            colorPropertyAtoms={colorPropertyAtoms}
            colorMapAtoms={colorMapAtoms}
            colorRangeAtoms={colorRangeAtoms}
          />
        </ParameterList>
      </InspectorItem>
    </>
  )
}
