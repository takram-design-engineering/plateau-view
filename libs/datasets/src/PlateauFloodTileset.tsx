import { Cesium3DTileStyle, Color, type Cesium3DTileset } from '@cesium/engine'
import { useTheme } from '@mui/material'
import { forwardRef, useMemo } from 'react'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'

export interface PlateauFloodTilesetProps
  extends Omit<PlateauTilesetProps, 'style' | 'selectionColor'> {}

export const PlateauFloodTileset = forwardRef<
  Cesium3DTileset,
  PlateauFloodTilesetProps
>((props, forwardedRef) => {
  const theme = useTheme()
  const style = useMemo(
    () =>
      new Cesium3DTileStyle({
        color: `color("${theme.palette.primary.main}", 0.5)`
      }),
    [theme]
  )
  const selectionColor = useMemo(
    () => Color.fromCssColorString(theme.palette.primary.main),
    [theme]
  )

  return (
    <PlateauTileset
      ref={forwardedRef}
      {...props}
      style={style}
      selectionColor={selectionColor}
      disableShadow
    />
  )
})
