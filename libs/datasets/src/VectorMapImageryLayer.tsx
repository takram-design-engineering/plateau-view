import {
  DiscardEmptyTileImagePolicy,
  UrlTemplateImageryProvider
} from '@cesium/engine'
import { forwardRef } from 'react'

import {
  ImageryLayer,
  type ImageryLayerHandle,
  type ImageryLayerProps
} from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface VectorMapImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {
  baseUrl: string
}

export const VectorMapImageryLayer = forwardRef<
  ImageryLayerHandle,
  VectorMapImageryLayerProps
>(({ baseUrl, ...props }, ref) => {
  const imageryProvider = useConstant(() => {
    const imageryProvider = new UrlTemplateImageryProvider({
      url: `${baseUrl}/light/{z}/{x}/{y}.webp`,
      maximumLevel: 22,
      tileDiscardPolicy: new DiscardEmptyTileImagePolicy(),
      tileWidth: 512,
      tileHeight: 512
    })
    imageryProvider.errorEvent.addEventListener(() => {}) // Suppress error log
    return imageryProvider
  })
  return <ImageryLayer ref={ref} imageryProvider={imageryProvider} {...props} />
})
