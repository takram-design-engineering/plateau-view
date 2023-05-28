import { Cesium3DTileStyle, type Cesium3DTileFeature } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import { colorModeAtom } from '@takram/plateau-shared-states'

export interface DefaultTileStyleParams {
  color?: string
  opacity?: number
}

export function useDefaultTileStyle({
  color,
  opacity = 1
}: DefaultTileStyleParams): Cesium3DTileStyle {
  const theme = useTheme()
  const colorMode = useAtomValue(colorModeAtom)
  return useMemo(() => {
    return new Cesium3DTileStyle({
      show: {
        evaluate: (feature: Cesium3DTileFeature) => {
          return feature.show
        }
      },
      color: {
        conditions: [
          // eslint-disable-next-line no-template-curly-in-string
          ['${selected}', `color("${theme.palette.primary.main}")`],
          [
            'true',
            `color("${
              color != null
                ? color
                : colorMode === 'light'
                ? '#ffffff'
                : '#444444'
            }", ${opacity})`
          ]
        ]
      }
    })
  }, [color, opacity, theme, colorMode])
}
