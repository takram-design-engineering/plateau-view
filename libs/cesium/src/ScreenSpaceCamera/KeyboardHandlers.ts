import {
  Cartesian3,
  Math as CesiumMath,
  Matrix4,
  PerspectiveFrustum,
  ScreenSpaceEventType,
  Transforms,
  type Scene
} from '@cesium/engine'
import { useRef, type FC } from 'react'
import invariant from 'tiny-invariant'

import { useConstant, useWindowEvent } from '@takram/plateau-react-helpers'

import { useCesium } from '../useCesium'
import { usePreUpdate } from '../useSceneEvent'
import { useScreenSpaceEvent } from '../useScreenSpaceEvent'
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler'
import { adjustHeightForTerrain } from './adjustHeightForTerrain'

const directions = [
  'forward',
  'backward',
  'right',
  'left',
  'up',
  'down'
] as const

type Direction = (typeof directions)[number]

function isDirection(value: unknown): value is Direction {
  return directions.includes(value as Direction)
}

const modes = ['sprint'] as const

type Mode = (typeof modes)[number]

function isMode(value: unknown): value is Mode {
  return modes.includes(value as Mode)
}

type KeyAssignments = Record<string, Direction | Mode>

const defaultKeyAssignments: KeyAssignments = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Space: 'up',
  ControlLeft: 'down',
  ShiftLeft: 'sprint'
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

export interface KeyboardHandlersProps {
  minimumZoomDistance: number
  acceleration?: number
  damping?: number
  maximumSpeed?: number
}

const matrixScratch = new Matrix4()
const forwardScratch = new Cartesian3()
const rightScratch = new Cartesian3()
const upScratch = new Cartesian3()

export const KeyboardHandlers: FC<KeyboardHandlersProps> = ({
  minimumZoomDistance,
  acceleration = 0.1,
  damping = 0.3,
  maximumSpeed = 3
}) => {
  const directionsRef = useRef<{
    forward?: number
    backward?: number
    right?: number
    left?: number
    up?: number
    down?: number
  }>({})

  const modesRef = useRef<{
    sprint?: boolean
  }>({})

  useWindowEvent('keydown', event => {
    const assignment = defaultKeyAssignments[event.code]
    if (assignment == null) {
      return
    }
    if (isDirection(assignment)) {
      directionsRef.current[assignment] = event.timeStamp
      event.preventDefault()
    } else if (isMode(assignment)) {
      modesRef.current[assignment] = true
      event.preventDefault()
    }
  })
  useWindowEvent('keyup', event => {
    const assignment = defaultKeyAssignments[event.code]
    if (assignment == null) {
      return
    }
    if (isDirection(assignment)) {
      directionsRef.current[assignment] = undefined
      event.preventDefault()
    } else if (isMode(assignment)) {
      modesRef.current[assignment] = false
      event.preventDefault()
    }
  })
  useWindowEvent('blur', () => {
    directionsRef.current = {}
    modesRef.current = {}
  })

  const scene = useCesium(({ scene }) => scene)
  const camera = scene.camera

  const handler = useScreenSpaceEventHandler()
  useScreenSpaceEvent(handler, ScreenSpaceEventType.WHEEL, value => {
    const frustum = camera.frustum
    invariant(frustum instanceof PerspectiveFrustum)
    frustum.fov = CesiumMath.clamp(
      frustum.fov - value / 5000,
      Math.PI * 0.1,
      Math.PI * 0.75
    )
  })

  const state = useConstant(() => ({
    time: Date.now(),
    direction: new Cartesian3(),
    speed: 0
  }))

  usePreUpdate(() => {
    const time = Date.now()
    const deltaSeconds = (time - state.time) / 1000
    state.time = time

    const directions = directionsRef.current
    const flags = modesRef.current
    const forwardSign = timeStampsToSign(
      directions.forward,
      directions.backward
    )
    const rightSign = timeStampsToSign(directions.right, directions.left)
    const upSign = timeStampsToSign(directions.up, directions.down)

    if (forwardSign !== 0 || rightSign !== 0 || upSign !== 0) {
      const matrix = Transforms.eastNorthUpToFixedFrame(
        camera.position,
        scene.globe.ellipsoid,
        matrixScratch
      )
      const up = Cartesian3.fromElements(
        matrix[8],
        matrix[9],
        matrix[10],
        upScratch
      )
      const forward = Cartesian3.multiplyByScalar(
        up,
        Cartesian3.dot(camera.direction, up),
        forwardScratch
      )
      Cartesian3.subtract(camera.direction, forward, forward)
      Cartesian3.normalize(forward, forward)
      const right = Cartesian3.multiplyByScalar(
        up,
        Cartesian3.dot(camera.right, up),
        rightScratch
      )
      Cartesian3.subtract(camera.right, right, right)
      Cartesian3.normalize(right, right)

      Cartesian3.multiplyByScalar(right, rightSign, right)
      Cartesian3.multiplyByScalar(up, upSign, up)
      Cartesian3.add(
        Cartesian3.multiplyByScalar(forward, forwardSign, forward),
        right,
        state.direction
      )
      Cartesian3.add(state.direction, up, state.direction)
      Cartesian3.normalize(state.direction, state.direction)
      if (flags.sprint === true) {
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
