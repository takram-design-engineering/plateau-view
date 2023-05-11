import { CameraEventType, KeyboardEventModifier } from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { assignPropertyProps } from '@plateau/react-helpers'

import { useCesium } from './useCesium'

const defaultOptions = {
  enableInputs: true,
  enableTranslate: true,
  enableZoom: true,
  enableRotate: true,
  enableTilt: true,
  enableLook: true
}

type ScreenSpaceCameraOptions = Partial<typeof defaultOptions>

export interface ScreenSpaceCameraProps extends ScreenSpaceCameraOptions {
  tiltByRightButton?: boolean
  minimumZoomDistance?: number
  maximumZoomDistance?: number
}

export const ScreenSpaceCamera: FC<ScreenSpaceCameraProps> = ({
  tiltByRightButton = false,
  minimumZoomDistance = 1,
  maximumZoomDistance = Infinity,
  ...options
}) => {
  const controller = useCesium(({ scene }) => scene.screenSpaceCameraController)
  useEffect(() => {
    controller.minimumZoomDistance = minimumZoomDistance
    controller.maximumZoomDistance = maximumZoomDistance

    if (tiltByRightButton) {
      // Remove right drag from zoom event types.
      controller.zoomEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH
      ]

      // Change control-drag to right drag for tilt event types.
      controller.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        }
      ]
    } else {
      // Reset to defaults.
      // https://github.com/CesiumGS/cesium/blob/1.104/packages/engine/Source/Scene/ScreenSpaceCamera.js
      controller.zoomEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH
      ]
      controller.tiltEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL
        }
      ]
    }
  }, [controller, tiltByRightButton, minimumZoomDistance, maximumZoomDistance])

  assignPropertyProps(controller, options, defaultOptions)

  return null
}
