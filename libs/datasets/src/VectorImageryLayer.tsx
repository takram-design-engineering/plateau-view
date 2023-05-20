import { type FC } from 'react'

import {
  ImageryLayer,
  useInstance,
  type ImageryLayerProps
} from '@takram/plateau-cesium'
import {
  VectorImageryProvider,
  type VectorImageryProviderOptions
} from '@takram/plateau-cesium-vector-imagery'

export interface VectorImageryLayerProps
  extends VectorImageryProviderOptions,
    Omit<ImageryLayerProps, 'imageryProvider'> {}

export const VectorImageryLayer: FC<VectorImageryLayerProps> = ({
  url,
  style,
  minimumZoom,
  maximumZoom,
  maximumDataZoom,
  zoomDifference,
  pixelRatio,
  rectangle,
  credit,
  cacheSize,
  useWorkerPool,
  ...props
}) => {
  const imageryProvider = useInstance({
    keys: [
      url,
      style,
      minimumZoom,
      maximumZoom,
      maximumDataZoom,
      zoomDifference,
      pixelRatio,
      rectangle,
      credit,
      cacheSize,
      useWorkerPool
    ],
    create: () =>
      new VectorImageryProvider({
        url,
        style,
        minimumZoom,
        maximumZoom,
        maximumDataZoom,
        zoomDifference,
        pixelRatio,
        rectangle,
        credit,
        cacheSize,
        useWorkerPool
      })
  })
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
