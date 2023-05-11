import {
  ImageryLayer as CesiumImageryLayer,
  type ImageryProvider
} from '@cesium/engine'

import { withEphemerality } from '@plateau/react-helpers'

import { useCesium } from './useCesium'
import { useInstance } from './useInstance'

export interface ImageryLayerProps
  extends CesiumImageryLayer.ConstructorOptions {
  imageryProvider: ImageryProvider
}

export const ImageryLayer = withEphemerality(
  () => useCesium(({ imageryLayers }) => imageryLayers),
  ['imageryProvider'],
  ({ imageryProvider, ...options }: ImageryLayerProps) => {
    const imageryLayers = useCesium(({ imageryLayers }) => imageryLayers)
    const imageryLayer = useInstance({
      owner: imageryLayers,
      keys: [imageryProvider],
      create: () => new CesiumImageryLayer(imageryProvider, options),
      transferOwnership: (imageryLayer, imageryLayers) => {
        imageryLayers.add(imageryLayer)
        return () => {
          imageryLayers.remove(imageryLayer)
        }
      }
    })

    Object.assign(imageryLayer, options)

    return null
  }
)
