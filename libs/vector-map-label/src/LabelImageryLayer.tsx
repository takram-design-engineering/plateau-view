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
  minimumDataLevel: number
  maximumDataLevel: number
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
      maximumDataLevel,
      ...props
    },
    ref
  ) => {
    const imageryProvider = useInstance({
      keys: [
        url,
        tilingScheme,
        tileWidth,
        tileHeight,
        minimumDataLevel,
        maximumDataLevel
      ],
      create: () =>
        new LabelImageryProvider({
          url,
          tilingScheme: tilingScheme ?? new WebMercatorTilingScheme(),
          tileWidth,
          tileHeight,
          minimumDataLevel,
          maximumDataLevel
        })
    })
    Object.assign(imageryProvider, {
      minimumLevel,
      maximumLevel
    })
    return (
      <ImageryLayer ref={ref} imageryProvider={imageryProvider} {...props} />
    )
  }
)
