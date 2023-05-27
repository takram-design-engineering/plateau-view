import { Cesium3DTileStyle } from '@cesium/engine'
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
  const colorMode = useAtomValue(colorModeAtom)
  return useMemo(
    () =>
      new Cesium3DTileStyle({
        color: `color("${
          color != null ? color : colorMode === 'light' ? '#ffffff' : '#444444'
        }", ${opacity})`
      }),
    [color, opacity, colorMode]
  )
}
