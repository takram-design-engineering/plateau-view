import { UrlTemplateImageryProvider } from '@cesium/engine'
import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

export interface PlateauImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {}

export const PlateauImageryLayer: FC<PlateauImageryLayerProps> = props => {
  const imageryProvider = useConstant(
    () =>
      new UrlTemplateImageryProvider({
        // https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/ortho/plateau-ortho-streaming.md
        url: 'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
        maximumLevel: 19
      })
  )
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
