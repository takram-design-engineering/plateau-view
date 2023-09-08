import { Divider } from '@mui/material'
import { max, min } from 'd3'
import { atom, useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { type LayerModel } from '@takram/plateau-layers'
import { isNotFalse } from '@takram/plateau-type-helpers'
import {
  ColorMapParameterItem,
  InspectorItem,
  ParameterList,
  SliderParameterItem
} from '@takram/plateau-ui-components'

export interface LayerHeatmapSectionProps {
  layers: readonly LayerModel[]
}

export const LayerHeatmapSection: FC<LayerHeatmapSectionProps> = ({
  layers
}) => {
  const colorSchemes = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const colorSchemes = layers.map(layer => get(layer.colorSchemeAtom))
          return colorSchemes.every(
            (
              colorScheme
            ): colorScheme is Extract<
              typeof colorScheme,
              { type: 'quantitative' }
            > => colorScheme?.type === 'quantitative'
          )
            ? colorSchemes
            : undefined
        }),
      [layers]
    )
  )
  const colorMapAtoms = useMemo(
    () => colorSchemes?.map(({ colorMapAtom }) => colorMapAtom),
    [colorSchemes]
  )
  const colorRangeAtoms = useMemo(
    () => colorSchemes?.map(({ colorRangeAtom }) => colorRangeAtom),
    [colorSchemes]
  )

  const contourSpacingAtoms = useMemo(() => {
    const atoms = layers.map(layer =>
      'contourSpacingAtom' in layer ? layer.contourSpacingAtom : undefined
    )
    return atoms.every(<T,>(atom: T | undefined): atom is T => atom != null)
      ? atoms
      : undefined
  }, [layers])

  const valueRange = useAtomValue(
    useMemo(
      () =>
        atom(get => {
          const ranges = layers
            .map(
              layer => 'valueRangeAtom' in layer && get(layer.valueRangeAtom)
            )
            .filter(isNotFalse)
          const minValue = min(ranges, ([min]) => min)
          const maxValue = max(ranges, ([, max]) => max)
          return minValue != null && maxValue != null
            ? [minValue, maxValue]
            : null
        }),
      [layers]
    )
  )

  if (
    colorMapAtoms == null ||
    colorRangeAtoms == null ||
    contourSpacingAtoms == null ||
    valueRange == null
  ) {
    return null
  }
  return (
    <>
      <Divider />
      <InspectorItem>
        <ParameterList>
          <ColorMapParameterItem label='配色' atom={colorMapAtoms} />
          <SliderParameterItem
            label='値範囲'
            // @ts-expect-error Safe assertion
            atom={colorRangeAtoms}
            min={valueRange[0]}
            max={valueRange[1]}
          />
          <SliderParameterItem
            label='等高線間隔'
            atom={contourSpacingAtoms}
            min={0}
            max={valueRange[1] / 10}
          />
        </ParameterList>
      </InspectorItem>
    </>
  )
}
