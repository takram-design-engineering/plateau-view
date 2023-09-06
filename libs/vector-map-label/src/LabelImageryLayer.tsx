import { WebMercatorTilingScheme } from '@cesium/engine'
import { forwardRef } from 'react'

import {
  ImageryLayer,
  useInstance,
  type ImageryLayerHandle,
  type ImageryLayerProps
} from '@takram/plateau-cesium'

import {
  LabelImageryProvider,
  type LabelImageryProviderOptions
} from './LabelImageryProvider'

export interface LabelImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'>,
    LabelImageryProviderOptions {
  minimumLevel?: number
  maximumLevel?: number
  minimumDataLevel?: number
}

export const LabelImageryLayer = forwardRef<
  ImageryLayerHandle,
  LabelImageryLayerProps
>(
  (
    {
      url,
      tilingScheme,
      tileWidth,
      tileHeight,
      minimumLevel,
      maximumLevel,
      minimumDataLevel,
      ...props
    },
    ref
  ) => {
    const imageryProvider = useInstance({
      keys: [url, tilingScheme, tileWidth, tileHeight],
      create: () =>
        new LabelImageryProvider({
          url,
          tilingScheme: tilingScheme ?? new WebMercatorTilingScheme(),
          tileWidth,
          tileHeight
        })
    })
    Object.assign(imageryProvider, {
      minimumLevel,
      maximumLevel,
      minimumDataLevel
    })
    return (
      <ImageryLayer ref={ref} imageryProvider={imageryProvider} {...props} />
    )
  }
)
