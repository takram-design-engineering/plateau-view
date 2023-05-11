import { type FC } from 'react'

import { ImageryLayer, type ImageryLayerProps } from '@plateau/cesium'
import { VectorImageryProvider } from '@plateau/cesium-vector-imagery'
import { useConstant } from '@plateau/react-helpers'

export interface InBrowserVectorMapImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {}

export const InBrowserVectorMapImageryLayer: FC<
  InBrowserVectorMapImageryLayerProps
> = props => {
  const imageryProvider = useConstant(
    () =>
      new VectorImageryProvider({
        url: 'https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf',
        styleUrl: '/assets/map-styles/light.json',
        maximumNativeZoom: 16,
        pixelRatio: 2
      })
  )
  return <ImageryLayer imageryProvider={imageryProvider} {...props} />
}
