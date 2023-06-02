import {
  TileCoordinatesImageryProvider,
  WebMercatorTilingScheme
} from '@cesium/engine'
import { type FC } from 'react'

import { useConstant } from '@takram/plateau-react-helpers'

import { ImageryLayer, type ImageryLayerProps } from './ImageryLayer'

export interface TileCoordinatesImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {}

export const TileCoordinatesImageryLayer: FC<
  TileCoordinatesImageryLayerProps
> = props => {
  const imageryProvider = useConstant(
    () =>
      new TileCoordinatesImageryProvider({
        tilingScheme: new WebMercatorTilingScheme()
      })
  )
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
