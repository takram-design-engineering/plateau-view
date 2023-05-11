import { UrlTemplateImageryProvider } from '@cesium/engine'
import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from '@plateau/cesium'
import { useConstant } from '@plateau/react-helpers'

export interface VectorMapImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {}

export const VectorMapImageryLayer: FC<VectorMapImageryLayerProps> = props => {
  const imageryProvider = useConstant(
    () =>
      new UrlTemplateImageryProvider({
        url: `${process.env.NEXT_PUBLIC_TILES_BASE_URL}/light/{z}/{x}/{y}.webp`
      })
  )
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
