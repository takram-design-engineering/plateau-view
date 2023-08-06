import {
  DiscardEmptyTileImagePolicy,
  TextureMagnificationFilter,
  TextureMinificationFilter,
  UrlTemplateImageryProvider
} from '@cesium/engine'
import { forwardRef } from 'react'

import {
  ImageryLayer,
  type ImageryLayerHandle,
  type ImageryLayerProps
} from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface TerrainElevationImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {
  baseUrl: string
}

export const TerrainElevationImageryLayer = forwardRef<
  ImageryLayerHandle,
  TerrainElevationImageryLayerProps
>(({ baseUrl, ...props }, ref) => {
  const imageryProvider = useConstant(() => {
    const imageryProvider = new UrlTemplateImageryProvider({
      url: `${baseUrl}/terrain/{z}/{x}/{y}.webp`,
      maximumLevel: 15,
      tileDiscardPolicy: new DiscardEmptyTileImagePolicy()
    })
    imageryProvider.errorEvent.addEventListener(() => {}) // Suppress error log
    return imageryProvider
  })

  return (
    <ImageryLayer
      ref={ref}
      imageryProvider={imageryProvider}
      magnificationFilter={TextureMagnificationFilter.LINEAR}
      minificationFilter={TextureMinificationFilter.NEAREST}
      {...props}
    />
  )
})
