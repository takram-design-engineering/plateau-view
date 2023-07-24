import { Cartographic, ScreenSpaceEventType } from '@cesium/engine'
import { type FC } from 'react'

import {
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'
import { getCameraEllipsoidIntersection } from '@takram/plateau-cesium-helpers'

import { LevitationCircle } from './LevitationCircle'
import { useMotionPosition } from './useMotionPosition'

export interface PedestrianToolProps {
  onClick?: (position: Cartographic) => void
}

export const PedestrianTool: FC<PedestrianToolProps> = ({ onClick }) => {
  const motionPosition = useMotionPosition()

  const scene = useCesium(({ scene }) => scene)
  const handler = useScreenSpaceEventHandler()
  useScreenSpaceEvent(
    handler,
    ScreenSpaceEventType.MOUSE_MOVE,
    ({ endPosition: screenPosition }) => {
      const position = getCameraEllipsoidIntersection(scene, screenPosition)
      if (position != null) {
        motionPosition.setPosition(position)
      }
    }
  )

  useScreenSpaceEvent(
    handler,
    ScreenSpaceEventType.LEFT_CLICK,
    ({ position: screenPosition }) => {
      const position = getCameraEllipsoidIntersection(scene, screenPosition)
      if (position != null) {
        const cartographic = Cartographic.fromCartesian(position)
        if (cartographic != null) {
          onClick?.(cartographic)
        }
      }
    }
  )

  return <LevitationCircle motionPosition={motionPosition} />
}
