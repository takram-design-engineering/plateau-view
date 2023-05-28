import { type Cesium3DTileset } from '@cesium/engine'
import { forwardRef } from 'react'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'
import { useDefaultTileStyle } from './useDefaultTileStyle'

export interface PlateauBuildingTilesetProps extends PlateauTilesetProps {
  color?: string
  opacity?: number
}

export const PlateauBuildingTileset = forwardRef<
  Cesium3DTileset,
  PlateauBuildingTilesetProps
>(({ color, opacity, ...props }, forwardedRef) => {
  const style = useDefaultTileStyle({ color, opacity })
  return <PlateauTileset ref={forwardedRef} {...props} style={style} />
})
