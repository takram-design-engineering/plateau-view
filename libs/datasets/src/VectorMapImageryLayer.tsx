import { UrlTemplateImageryProvider } from '@cesium/engine'
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
  const imageryProvider = useConstant(
    () =>
      new UrlTemplateImageryProvider({
        url: `${baseUrl}/light/{z}/{x}/{y}.webp`
      })
  )
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
