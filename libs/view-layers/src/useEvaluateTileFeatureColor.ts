import { Color } from '@cesium/engine'
import { atom, useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { type ColorScheme } from '@takram/plateau-color-schemes'
import {
  type EvaluateTileFeatureColor,
  type QualitativeColorSet
} from '@takram/plateau-datasets'

export interface EvaluateTileFeatureColorParams {
  colorProperty?: string
  colorScheme: ColorScheme
  colorRange: number[]
  colorSet?: QualitativeColorSet
}

export function useEvaluateTileFeatureColor({
  colorProperty,
  colorScheme,
  colorRange,
  colorSet
}: EvaluateTileFeatureColorParams): EvaluateTileFeatureColor | undefined {
  const colorSetColors = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          colorSet != null
            ? get(colorSet.colorsAtom).map(color => ({
                ...color,
                color: Color.fromCssColorString(color.color)
              }))
            : undefined
        ),
      [colorSet]
    )
  )

  return useMemo(() => {
    if (colorProperty == null) {
      return
    }
    if (colorSetColors != null) {
      return (feature, result) => {
        const property = feature.getProperty(colorProperty) ?? null
        const color = colorSetColors.find(({ value }) => property === value)
        return color != null ? color.color.clone(result) : undefined
      }
    }
    return (feature, result) => {
      const property = feature.getProperty(colorProperty)
      if (property == null) {
        return undefined
      }
      const [minValue, maxValue] = colorRange
      if (minValue === maxValue) {
        return result
      }
      const color = colorScheme.linear(
        (property - minValue) / (maxValue - minValue)
      )
      result.red = color[0]
      result.green = color[1]
      result.blue = color[2]
      return result
    }
  }, [colorProperty, colorScheme, colorRange, colorSetColors])
}
