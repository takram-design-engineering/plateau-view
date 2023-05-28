import { type Cesium3DTileset } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { forwardRef } from 'react'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'
import { useDefaultTileStyle } from './useDefaultTileStyle'

export interface PlateauWaterSurfaceTilesetProps extends PlateauTilesetProps {}

export const PlateauWaterSurfaceTileset = forwardRef<
  Cesium3DTileset,
  PlateauWaterSurfaceTilesetProps
>((props, forwardedRef) => {
  const theme = useTheme()
  const style = useDefaultTileStyle({
    color: theme.palette.primary.main,
    opacity: 0.5
  })
  return (
    <PlateauTileset ref={forwardedRef} {...props} style={style} disableShadow />
  )
})
