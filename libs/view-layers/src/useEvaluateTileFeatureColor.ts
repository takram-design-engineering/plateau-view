import { type Cesium3DTileFeature, type Color } from '@cesium/engine'
import { useAtomValue, type Atom } from 'jotai'
import { useMemo } from 'react'

import { type ColorScheme } from '@takram/plateau-color-schemes'
import { type EvaluateTileFeatureColor } from '@takram/plateau-datasets'

export interface EvaluateTileFeatureColorParams {
  colorPropertyAtom: Atom<string | null>
  colorSchemeAtom: Atom<ColorScheme>
  colorRangeAtom: Atom<[number, number]>
}

export function useEvaluateTileFeatureColor({
  colorPropertyAtom,
  colorSchemeAtom,
  colorRangeAtom
}: EvaluateTileFeatureColorParams): EvaluateTileFeatureColor | undefined {
  const colorProperty = useAtomValue(colorPropertyAtom)
  const colorScheme = useAtomValue(colorSchemeAtom)
  const colorRange = useAtomValue(colorRangeAtom)
  return useMemo(
    () =>
      colorProperty != null
        ? (feature: Cesium3DTileFeature, result: Color): Color => {
            const property = feature.getProperty(colorProperty) ?? 0
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
        : undefined,
    [colorProperty, colorScheme, colorRange]
  )
}
