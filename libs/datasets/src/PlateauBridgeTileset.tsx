import { type Cesium3DTileset } from '@cesium/engine'
import { forwardRef } from 'react'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'
import { useDefaultTileStyle } from './useDefaultTileStyle'

export interface PlateauBridgeTilesetProps
  extends Omit<PlateauTilesetProps, 'style' | 'selectionColor'> {
  color?: string
  opacity?: number
}

export const PlateauBridgeTileset = forwardRef<
  Cesium3DTileset,
  PlateauBridgeTilesetProps
>(({ color, opacity, ...props }, forwardedRef) => {
  const style = useDefaultTileStyle({ color, opacity })
  return <PlateauTileset ref={forwardedRef} {...props} style={style} />
})
