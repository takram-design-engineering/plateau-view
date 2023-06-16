import {
  CameraEventType,
  Cartesian3,
  Math as CesiumMath,
  JulianDate,
  KeyboardEventModifier,
  type Scene
} from '@cesium/engine'
import { useEffect, useRef, type FC } from 'react'

import {
  assignPropertyProps,
  useConstant,
  useWindowEvent
} from '@takram/plateau-react-helpers'

import { adjustHeightForTerrain } from './adjustHeightForTerrain'
import { useCesium } from './useCesium'
import { usePreRender, usePreUpdate } from './useSceneEvent'

type Direction = 'forward' | 'backward' | 'right' | 'left' | 'up' | 'down'

const keyAssignments: Record<string, Direction | undefined> = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'up',
  ControlLeft: 'down'
}

function timeStampsToSign(positive?: number, negative?: number): number {
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

interface KeyboardHandlersProps {
  minimumZoomDistance: number
  acceleration?: number
  damping?: number
  maximumSpeed?: number
}

const KeyboardHandlers: FC<KeyboardHandlersProps> = ({
  minimumZoomDistance,
  acceleration = 0.1,
  damping = 0.3,
  maximumSpeed = 3
}) => {
  const keysRef = useRef<{
    forward?: number
    backward?: number
    right?: number
    left?: number
    up?: number
    down?: number
    sprint?: boolean
  }>({})

  useWindowEvent('keydown', event => {
    const direction = keyAssignments[event.code]
    if (direction != null) {
      keysRef.current[direction] = event.timeStamp
      event.preventDefault()
    } else if (event.code === 'ShiftLeft') {
      keysRef.current.sprint = true
      event.preventDefault()
    }
  })
  useWindowEvent('keyup', event => {
    const direction = keyAssignments[event.code]
    if (direction != null) {
      keysRef.current[direction] = undefined
      event.preventDefault()
    } else if (event.code === 'ShiftLeft') {
      keysRef.current.sprint = false
      event.preventDefault()
    }
  })
  useWindowEvent('blur', () => {
    keysRef.current = {}
  })

  const state = useConstant(() => ({
    time: new JulianDate(),
    direction: new Cartesian3(),
    speed: 0
  }))

  const scene = useCesium(({ scene }) => scene)
  const camera = useCesium(({ camera }) => camera)

  usePreUpdate(() => {
    const time = JulianDate.now(timeScratch)
    const deltaSeconds = JulianDate.secondsDifference(time, state.time)
    time.clone(state.time)

    const keys = keysRef.current
    const forward = timeStampsToSign(keys.forward, keys.backward)
    const right = timeStampsToSign(keys.right, keys.left)
    const up = timeStampsToSign(keys.up, keys.down)

    if (forward !== 0 || right !== 0 || up !== 0) {
      Cartesian3.multiplyByScalar(camera.direction, forward, forwardScratch)
      Cartesian3.multiplyByScalar(camera.right, right, rightScratch)
      Cartesian3.multiplyByScalar(camera.up, up, upScratch)
      Cartesian3.add(forwardScratch, rightScratch, state.direction)
      Cartesian3.add(state.direction, upScratch, state.direction)
      Cartesian3.normalize(state.direction, state.direction)
      if (keys.sprint === true) {
        state.speed = Math.min(maximumSpeed * 2, state.speed + acceleration)
      } else if (state.speed > 1) {
        state.speed = Math.max(maximumSpeed, state.speed - damping)
      } else {
        state.speed = Math.min(maximumSpeed, state.speed + acceleration)
      }
    } else {
      state.speed = Math.max(0, state.speed - damping)
    }

    if (state.speed > 0.01) {
      let speed = state.speed
      const { globeHeight } = scene as Scene & { globeHeight?: number }
      if (globeHeight != null) {
        const cameraHeight = scene.camera.positionCartographic.height
        speed *= 1 + Math.max(0, cameraHeight - globeHeight) * 0.1
      }
      camera.move(state.direction, speed * deltaSeconds)
      adjustHeightForTerrain(scene, minimumZoomDistance)
    }
  })

  return null
}

export interface ScreenSpaceCameraProps
  extends ScreenSpaceCameraOptions,
    Omit<KeyboardHandlersProps, 'minimumZoomDistance'> {
  tiltByRightButton?: boolean
  minimumZoomDistance?: number
  maximumZoomDistance?: number
  useKeyboard?: boolean
}

const forwardScratch = new Cartesian3()
const rightScratch = new Cartesian3()
const upScratch = new Cartesian3()
const timeScratch = new JulianDate()

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
