import {
  Cartesian3,
  Cartographic,
  Ray,
  ScreenSpaceEventType
} from '@cesium/engine'
import { type FC } from 'react'

import {
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'

import { LevitationCircle } from './LevitationCircle'
import { useMotionPosition } from './useMotionPosition'

export interface PedestrianToolProps {
  onCreate?: (position: Cartographic) => void
}

const rayScratch = new Ray()
const positionScratch = new Cartesian3()
const cartographicScratch = new Cartographic()

export const PedestrianTool: FC<PedestrianToolProps> = ({ onCreate }) => {
  const motionPosition = useMotionPosition()

  const scene = useCesium(({ scene }) => scene)
  const handler = useScreenSpaceEventHandler()
  useScreenSpaceEvent(
    handler,
    ScreenSpaceEventType.MOUSE_MOVE,
    ({ endPosition: screenPosition }) => {
      const ray = scene.camera.getPickRay(screenPosition, rayScratch)
      if (ray == null) {
        return
      }
      const position = scene.globe.pick(ray, scene, positionScratch)
      if (position == null) {
        return
      }
      motionPosition.setPosition(position)
    }
  )

  useScreenSpaceEvent(
    handler,
    ScreenSpaceEventType.LEFT_CLICK,
    ({ position: screenPosition }) => {
      const ray = scene.camera.getPickRay(screenPosition, rayScratch)
      if (ray == null) {
        return
      }
      const position = scene.globe.pick(ray, scene, positionScratch)
      if (position == null) {
        return
      }
      const cartographic = Cartographic.fromCartesian(
        position,
        scene.globe.ellipsoid,
        cartographicScratch
      )
      if (cartographic == null) {
        return
      }
      onCreate?.(cartographic)
    }
  )

  return <LevitationCircle motionPosition={motionPosition} />
}
