import {
  DiscardEmptyTileImagePolicy,
  UrlTemplateImageryProvider
} from '@cesium/engine'
import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from '@takram/plateau-cesium'
import { useConstant, withEphemerality } from '@takram/plateau-react-helpers'

export interface VectorMapImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {
  baseUrl: string
  path: string
}

export const VectorMapImageryLayer: FC<VectorMapImageryLayerProps> =
  withEphemerality(null, ['baseUrl', 'path'], ({ baseUrl, path, ...props }) => {
    const imageryProvider = useConstant(() => {
      const imageryProvider = new UrlTemplateImageryProvider({
        url: `${baseUrl}/${path}/{z}/{x}/{y}.webp`,
        maximumLevel: 22,
        tileDiscardPolicy: new DiscardEmptyTileImagePolicy(),
        tileWidth: 512,
        tileHeight: 512
      })
      imageryProvider.errorEvent.addEventListener(() => {}) // Suppress error log
      return imageryProvider
    })
    return <ImageryLayer imageryProvider={imageryProvider} {...props} />
  })
