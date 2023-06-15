import {
  CameraEventType,
  Cartesian3,
  Math as CesiumMath,
  KeyboardEventModifier
} from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import {
  assignPropertyProps,
  useWindowEvent
} from '@takram/plateau-react-helpers'

import { adjustHeightForTerrain } from './adjustHeightForTerrain'
import { useCesium } from './useCesium'
import { usePreRender, usePreUpdate } from './useSceneEvent'

const ROLL_EPSILON = Math.PI / 86400

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

export interface ScreenSpaceCameraProps extends ScreenSpaceCameraOptions {
  tiltByRightButton?: boolean
  minimumZoomDistance?: number
  maximumZoomDistance?: number
  useKeyboard?: boolean
}

type Direction = 'forward' | 'backward' | 'right' | 'left' | 'up' | 'down'

const keyAssignments: Record<string, Direction | undefined> = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'up',
  ShiftLeft: 'down'
}

function getDirection(positive?: number, negative?: number): number {
  return positive != null
    ? negative != null
      ? positive > negative
        ? 1
        : -1
      : 1
    : negative != null
    ? -1
    : 0
}

const forwardScratch = new Cartesian3()
const rightScratch = new Cartesian3()
const upScratch = new Cartesian3()
const directionScratch = new Cartesian3()

export const ScreenSpaceCamera: FC<ScreenSpaceCameraProps> = ({
  tiltByRightButton = false,
  useKeyboard = false,
  minimumZoomDistance = 1.5,
  maximumZoomDistance = Infinity,
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
        lookEventTypes: CameraEventType.LEFT_DRAG
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
    if (Math.abs(CesiumMath.negativePiToPi(camera.roll)) > ROLL_EPSILON) {
      camera.setView({
        orientation: {
          heading: camera.heading,
          pitch: camera.pitch,
          roll: 0
        }
      })
    }
  })

  const keysRef = useRef<{
    forward?: number
    backward?: number
    right?: number
    left?: number
    up?: number
    down?: number
  }>({})

  useWindowEvent('keydown', event => {
    const direction = keyAssignments[event.code]
    if (direction != null) {
      keysRef.current[direction] = event.timeStamp
    }
  })
  useWindowEvent('keyup', event => {
    const direction = keyAssignments[event.code]
    if (direction != null) {
      keysRef.current[direction] = undefined
    }
  })
  useWindowEvent('blur', () => {
    keysRef.current = {}
  })

  const scene = useCesium(({ scene }) => scene)
  usePreUpdate(() => {
    const keys = keysRef.current
    const forward = getDirection(keys.forward, keys.backward)
    const right = getDirection(keys.right, keys.left)
    const up = getDirection(keys.up, keys.down)
    if (forward !== 0 || right !== 0 || up !== 0) {
      Cartesian3.multiplyByScalar(camera.direction, forward, forwardScratch)
      Cartesian3.multiplyByScalar(camera.right, right, rightScratch)
      Cartesian3.multiplyByScalar(camera.up, up, upScratch)
      Cartesian3.add(forwardScratch, rightScratch, directionScratch)
      Cartesian3.add(directionScratch, upScratch, directionScratch)
      Cartesian3.normalize(directionScratch, directionScratch)
      // TODO: Delta from previous time.
      camera.move(directionScratch, 1)
      adjustHeightForTerrain(scene, minimumZoomDistance)
    }
  })

  return null
}
