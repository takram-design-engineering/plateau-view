import { Color } from '@cesium/engine'
import { atom, useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { type ColorMap } from '@takram/plateau-color-maps'
import {
  type EvaluateTileFeatureColor,
  type QualitativeColorSet
} from '@takram/plateau-datasets'

export interface EvaluateTileFeatureColorParams {
  colorProperty?: string
  colorMap: ColorMap
  colorRange: number[]
  colorSet?: QualitativeColorSet
}

export function useEvaluateTileFeatureColor({
  colorProperty,
  colorMap,
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
      const color = colorMap.linear(
        (property - minValue) / (maxValue - minValue)
      )
      result.red = color[0]
      result.green = color[1]
      result.blue = color[2]
      return result
    }
  }, [colorProperty, colorMap, colorRange, colorSetColors])
}
