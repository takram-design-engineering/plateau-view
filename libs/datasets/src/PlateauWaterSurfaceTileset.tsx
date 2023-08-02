import { type Cesium3DTileset, type Cesium3DTileStyle } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { forwardRef, useEffect, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'
import { type EvaluateTileFeatureColor } from './types'
import { useDefaultTileStyle } from './useDefaultTileStyle'

export interface PlateauWaterSurfaceTilesetProps extends PlateauTilesetProps {
  color?: string | EvaluateTileFeatureColor
  opacity?: number
  style?: Cesium3DTileStyle
}

export const PlateauWaterSurfaceTileset = forwardRef<
  Cesium3DTileset,
  PlateauWaterSurfaceTilesetProps
>(({ color, opacity = 0.5, style, ...props }, forwardedRef) => {
  const theme = useTheme()
  const defaultStyle = useDefaultTileStyle({
    color: color ?? theme.palette.primary.main,
    opacity
  })

  const ref = useRef<Cesium3DTileset>(null)
  useEffect(() => {
    ref.current?.makeStyleDirty()
  }, [color, opacity])

  return (
    <PlateauTileset
      ref={mergeRefs([ref, forwardedRef])}
      {...props}
      style={style ?? defaultStyle}
      disableShadow
    />
  )
})
