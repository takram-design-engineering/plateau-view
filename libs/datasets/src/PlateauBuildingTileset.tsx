import { type Cesium3DTileset, type Cesium3DTileStyle } from '@cesium/engine'
import { forwardRef, useEffect, useRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { PlateauTileset, type PlateauTilesetProps } from './PlateauTileset'
import { type EvaluateTileFeatureColor } from './types'
import { useDefaultTileStyle } from './useDefaultTileStyle'

export interface PlateauBuildingTilesetProps extends PlateauTilesetProps {
  color?: string | EvaluateTileFeatureColor
  opacity?: number
  style?: Cesium3DTileStyle
}

export const PlateauBuildingTileset = forwardRef<
  Cesium3DTileset,
  PlateauBuildingTilesetProps
>(({ color, opacity, style, ...props }, forwardedRef) => {
  const defaultStyle = useDefaultTileStyle({ color, opacity })

  const ref = useRef<Cesium3DTileset>(null)
  useEffect(() => {
    ref.current?.makeStyleDirty()
  }, [color, opacity])

  return (
    <PlateauTileset
      ref={mergeRefs([ref, forwardedRef])}
      {...props}
      style={style ?? defaultStyle}
    />
  )
})
