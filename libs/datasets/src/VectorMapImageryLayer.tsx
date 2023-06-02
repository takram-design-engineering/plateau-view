import {
  DiscardEmptyTileImagePolicy,
  UrlTemplateImageryProvider
} from '@cesium/engine'
import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface VectorMapImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {
  baseUrl: string
}

export const VectorMapImageryLayer: FC<VectorMapImageryLayerProps> = ({
  baseUrl,
  ...props
}) => {
  const imageryProvider = useConstant(() => {
    const imageryProvider = new UrlTemplateImageryProvider({
      url: `${baseUrl}/light/{z}/{x}/{y}.webp`,
      maximumLevel: 24,
      tileDiscardPolicy: new DiscardEmptyTileImagePolicy()
    })
    imageryProvider.errorEvent.addEventListener(() => {}) // Suppress error log
    return imageryProvider
  })
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
