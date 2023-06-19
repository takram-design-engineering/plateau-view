import { BingMapsImageryProvider, BingMapsStyle } from '@cesium/engine'
import { type FC } from 'react'

import {
  ImageryLayer,
  useSuspendInstance,
  type ImageryLayerProps
} from '@takram/plateau-cesium'

export interface BingMapsImageryLayerProps
  extends Omit<ImageryLayerProps, 'imageryProvider'> {
  appKey: string
}

export const BingMapsImageryLayer: FC<BingMapsImageryLayerProps> = ({
  appKey,
  ...props
}) => {
  const imageryProvider = useSuspendInstance({
    owner: BingMapsImageryLayer,
    keys: [appKey],
    create: async () =>
      await BingMapsImageryProvider.fromUrl('https://dev.virtualearth.net', {
        key: appKey,
        mapStyle: BingMapsStyle.AERIAL
      })
  })

  return (
    <ImageryLayer
      imageryProvider={imageryProvider}
      contrast={0.6}
      brightness={1.5}
      saturation={0.75}
      {...props}
    />
  )
}
