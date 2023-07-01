import {
  Cesium3DTileStyle,
  Color,
  type Cesium3DTileFeature
} from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useMemo, useRef } from 'react'

import { colorModeAtom } from '@takram/plateau-shared-states'

export type EvaluateColor = (
  feature: Cesium3DTileFeature,
  result: Color
) => Color

export interface DefaultTileStyleParams {
  color?: string | EvaluateColor
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
          if (feature.getProperty('selected') === true) {
            result = Color.fromCssColorString(
              theme.palette.primary.main,
              result
            )
          } else if (color == null) {
            result = Color.fromCssColorString(
              colorMode === 'light' ? '#ffffff' : '#444444',
              result
            )
          } else if (typeof color === 'string') {
            result = Color.fromCssColorString(color, result)
          } else {
            try {
              result = color(feature, result)
            } catch (error) {
              console.error(error)
              result = Color.fromCssColorString(
                colorMode === 'light' ? '#ffffff' : '#444444',
                result
              )
            }
          }
          return result.withAlpha(opacity, result)
        }
      }
    })
  }, [theme, colorMode])
}
