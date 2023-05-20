import { type FC } from 'react'

import {
  ImageryLayer,
  useInstance,
  type ImageryLayerProps
} from '@plateau/cesium'
import {
  VectorImageryProvider,
  type VectorImageryProviderOptions
} from '@plateau/cesium-vector-imagery'

export interface VectorImageryLayerProps
  extends VectorImageryProviderOptions,
    Omit<ImageryLayerProps, 'imageryProvider'> {}

export const VectorImageryLayer: FC<VectorImageryLayerProps> = ({
  url,
  style,
  minimumZoom,
  maximumZoom,
  maximumNativeZoom,
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
      maximumNativeZoom,
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
        maximumNativeZoom,
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
