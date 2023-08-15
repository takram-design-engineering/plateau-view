import {
  TileCoordinatesImageryProvider,
  WebMercatorTilingScheme
} from '@cesium/engine'
import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from './ImageryLayer'
import { useInstance } from './useInstance'

export interface TileCoordinatesImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'>,
    TileCoordinatesImageryProvider.ConstructorOptions {}

export const TileCoordinatesImageryLayer: FC<
  TileCoordinatesImageryLayerProps
> = ({ tilingScheme, ellipsoid, color, tileWidth, tileHeight, ...props }) => {
  const imageryProvider = useInstance({
    keys: [tilingScheme, ellipsoid, color, tileWidth, tileHeight],
    create: () =>
      new TileCoordinatesImageryProvider({
        tilingScheme: tilingScheme ?? new WebMercatorTilingScheme(),
        ellipsoid,
        color,
        tileWidth,
        tileHeight
      })
  })

  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
