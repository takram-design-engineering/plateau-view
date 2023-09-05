import {
  ImageryLayer as CesiumImageryLayer,
  type ImageryProvider
} from '@cesium/engine'
import { forwardRef } from 'react'

import {
  assignForwardedRef,
  withEphemerality
} from '@takram/plateau-react-helpers'

import { useCesium } from './useCesium'
import { useInstance } from './useInstance'

export interface ImageryLayerHandle {
  imageryLayer: CesiumImageryLayer
  bringToFront: () => void
  sendToBack: () => void
}

export interface ImageryLayerProps
  extends CesiumImageryLayer.ConstructorOptions {
  imageryProvider: ImageryProvider
}

export const ImageryLayer = withEphemerality(
  () => useCesium(({ imageryLayers }) => imageryLayers),
  ['imageryProvider'],
  forwardRef<ImageryLayerHandle, ImageryLayerProps>(
    ({ imageryProvider, ...options }, ref) => {
      const imageryLayers = useCesium(({ imageryLayers }) => imageryLayers)
      const imageryLayer = useInstance({
        owner: imageryLayers,
        keys: [imageryProvider],
        create: () => new CesiumImageryLayer(imageryProvider, options),
        transferOwnership: (imageryLayer, imageryLayers) => {
          imageryLayers.add(imageryLayer)

          assignForwardedRef(ref, {
            imageryLayer,
            bringToFront: () => {
              imageryLayers.raiseToTop(imageryLayer)
            },
            sendToBack: () => {
              imageryLayers.lowerToBottom(imageryLayer)
            }
          })

          return () => {
            assignForwardedRef(ref, null)
            imageryLayers.remove(imageryLayer)
          }
        }
      })

      const scene = useCesium(({ scene }) => scene)
      scene.requestRender()

      Object.assign(imageryLayer, options)

      // TODO: Re-assign handle when ref changes.

      return null
    }
  )
)
