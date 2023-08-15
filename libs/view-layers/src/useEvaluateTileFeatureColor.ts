import { Color } from '@cesium/engine'
import { atom, useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { type EvaluateTileFeatureColor } from '@takram/plateau-datasets'

import { type LayerColorScheme } from './types'

export interface EvaluateTileFeatureColorParams {
  colorProperty?: string
  colorScheme?: LayerColorScheme
}

export function useEvaluateTileFeatureColor({
  colorProperty,
  colorScheme
}: EvaluateTileFeatureColorParams): EvaluateTileFeatureColor | undefined {
  const colorSetColors = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          colorScheme?.type === 'qualitative'
            ? get(colorScheme.colorsAtom).map(color => ({
                ...color,
                color: Color.fromCssColorString(color.color)
              }))
            : undefined
        ),
      [colorScheme]
    )
  )

  const colorMapParams = useAtomValue(
    useMemo(
      () =>
        atom(get =>
          colorScheme?.type === 'quantitative'
            ? {
                colorMap: get(colorScheme.colorMapAtom),
                colorRange: get(colorScheme.colorRangeAtom)
              }
            : undefined
        ),
      [colorScheme]
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
    if (colorMapParams != null) {
      const { colorMap, colorRange } = colorMapParams
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
    }
  }, [colorProperty, colorSetColors, colorMapParams])
}
