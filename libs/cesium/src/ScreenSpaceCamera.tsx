import {
  CameraEventType,
  Math as CesiumMath,
  KeyboardEventModifier
} from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { assignPropertyProps } from '@takram/plateau-react-helpers'

import {
  KeyboardHandlers,
  type KeyboardHandlersProps
} from './ScreenSpaceCamera/KeyboardHandlers'
import { useCesium } from './useCesium'
import { usePreRender } from './useSceneEvent'

const defaultOptions = {
  enableInputs: true,
  enableTranslate: true,
  enableZoom: true,
  enableRotate: true,
  enableTilt: true,
  enableLook: true
}

// https://github.com/CesiumGS/cesium/blob/1.104/packages/engine/Source/Scene/ScreenSpaceCamera.js
const defaultAssignments = {
  translateEventTypes: CameraEventType.LEFT_DRAG,
  zoomEventTypes: [
    CameraEventType.RIGHT_DRAG,
    CameraEventType.WHEEL,
    CameraEventType.PINCH
  ],
  rotateEventTypes: CameraEventType.LEFT_DRAG,
  tiltEventTypes: [
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
  ],
  lookEventTypes: [
    {
      eventType: CameraEventType.LEFT_DRAG,
      modifier: KeyboardEventModifier.SHIFT
    }
  ]
}

type ScreenSpaceCameraOptions = Partial<typeof defaultOptions>

export interface ScreenSpaceCameraProps
  extends ScreenSpaceCameraOptions,
    Omit<KeyboardHandlersProps, 'minimumZoomDistance'> {
  tiltByRightButton?: boolean
  minimumZoomDistance?: number
  maximumZoomDistance?: number
  useKeyboard?: boolean
}

export const ScreenSpaceCamera: FC<ScreenSpaceCameraProps> = ({
  tiltByRightButton = false,
  minimumZoomDistance = 1.5,
  maximumZoomDistance = Infinity,
  useKeyboard = false,
  acceleration,
  damping,
  maximumSpeed,
  ...options
}) => {
  const controller = useCesium(({ scene }) => scene.screenSpaceCameraController)

  useEffect(() => {
    controller.minimumZoomDistance = minimumZoomDistance
    controller.maximumZoomDistance = maximumZoomDistance
    controller.enableCollisionDetection = !useKeyboard

    if (useKeyboard) {
      Object.assign(controller, {
        zoomEventTypes: [],
        rotateEventTypes: [],
        tiltEventTypes: [],
        lookEventTypes: [
          CameraEventType.LEFT_DRAG,
          {
            eventType: CameraEventType.LEFT_DRAG,
            modifier: KeyboardEventModifier.CTRL
          },
          {
            eventType: CameraEventType.LEFT_DRAG,
            modifier: KeyboardEventModifier.SHIFT
          }
        ]
      })
    } else if (tiltByRightButton) {
      Object.assign(controller, {
        ...defaultAssignments,
        // Remove right drag from zoom event types.
        zoomEventTypes: [
          CameraEventType.MIDDLE_DRAG,
          CameraEventType.WHEEL,
          CameraEventType.PINCH
        ],
        // Change control-drag to right drag for tilt event types.
        tiltEventTypes: [
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
      })
    } else {
      Object.assign(controller, defaultAssignments)
    }
  }, [
    controller,
    tiltByRightButton,
    useKeyboard,
    minimumZoomDistance,
    maximumZoomDistance
  ])

  assignPropertyProps(controller, options, defaultOptions)

  // Maintain horizontal roll.
  const camera = useCesium(({ camera }) => camera)
  usePreRender(() => {
    if (Math.abs(CesiumMath.negativePiToPi(camera.roll)) > Math.PI / 86400) {
      camera.setView({
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch,
          roll: 0
        }
      })
    }
  })

  return useKeyboard ? (
    <KeyboardHandlers
      minimumZoomDistance={minimumZoomDistance}
      acceleration={acceleration}
      damping={damping}
      maximumSpeed={maximumSpeed}
    />
  ) : null
}
