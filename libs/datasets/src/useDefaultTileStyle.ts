import {
  Cesium3DTileStyle,
  Color,
  type Cesium3DTileFeature
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'

import { colorModeAtom } from '@takram/plateau-shared-states'

import { type EvaluateTileFeatureColor } from './types'

export interface DefaultTileStyleParams {
  color?: string | EvaluateTileFeatureColor
  opacity?: number
}

export function useDefaultTileStyle({
  color,
  opacity = 1
}: DefaultTileStyleParams): Cesium3DTileStyle {
  const theme = useTheme()
  const colorMode = useAtomValue(colorModeAtom)

  const ref = useRef({ color, opacity })
  Object.assign(ref.current, { color, opacity })

  return useMemo(() => {
    return new Cesium3DTileStyle({
      show: {
        evaluate: (feature: Cesium3DTileFeature) => {
          return feature.show
        }
      },
      color: {
        evaluateColor: (feature: Cesium3DTileFeature, result: Color): Color => {
          const { color, opacity } = ref.current
          if (feature.getProperty('__selected') === true) {
            return Color.fromCssColorString(theme.palette.primary.main, result)
          }
          if (typeof color === 'string') {
            return Color.fromCssColorString(color, result).withAlpha(
              opacity,
              result
            )
          }
          if (color != null) {
            try {
              if (color(feature, result) != null) {
                return result.withAlpha(opacity, result)
              }
            } catch (error) {
              console.error(error)
            }
          }
          return Color.fromCssColorString(
            colorMode === 'light' ? '#ffffff' : '#444444',
            result
          ).withAlpha(opacity, result)
        }
      }
    })
  }, [theme, colorMode])
}
