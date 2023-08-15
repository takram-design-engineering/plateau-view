import { forwardRef } from 'react'

import {
  ImageryLayer,
  useInstance,
  type ImageryLayerHandle,
  type ImageryLayerProps
} from '@takram/plateau-cesium'
import {
  VectorImageryProvider,
  type VectorImageryProviderOptions
} from '@takram/plateau-cesium-vector-imagery'

export interface VectorImageryLayerProps
  extends VectorImageryProviderOptions,
    Omit<ImageryLayerProps, 'imageryProvider'> {}

export const VectorImageryLayer = forwardRef<
  ImageryLayerHandle,
  VectorImageryLayerProps
>(
  (
    {
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
    },
    ref
  ) => {
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
    return (
      <ImageryLayer ref={ref} imageryProvider={imageryProvider} {...props} />
    )
  }
)
