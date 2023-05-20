import { Cartesian3, Cartographic, ScreenSpaceEventType } from '@cesium/engine'
import { useRef } from 'react'

import {
  useCesium,
  useScreenSpaceEvent,
  useScreenSpaceEventHandler
} from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { pickGround } from './pickGround'

export class DragEvent {
  cartesianStart = new Cartesian3()
  cartesianEnd = new Cartesian3()
  cartographicStart = new Cartographic()
  cartographicEnd = new Cartographic()
  distance = 0
}

export type ScreenSpaceDragHandler = (event: DragEvent) => void

export function useScreenSpaceDrag(handler: ScreenSpaceDragHandler): void {
  const dragEvent = useConstant(() => new DragEvent())

  const stateRef = useRef(false)
  const scene = useCesium(({ scene }) => scene)
  const eventHandler = useScreenSpaceEventHandler()

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_DOWN, event => {
    const cartesianStart = pickGround(
      scene,
      event.position,
      dragEvent.cartesianStart
    )
    stateRef.current = cartesianStart != null
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.LEFT_UP, () => {
    stateRef.current = false
  })

  useScreenSpaceEvent(eventHandler, ScreenSpaceEventType.MOUSE_MOVE, event => {
    if (!stateRef.current) {
      return
    }
    const cartesianEnd = pickGround(
      scene,
      event.endPosition,
      dragEvent.cartesianEnd
    )
    if (cartesianEnd == null) {
      return
    }
    dragEvent.distance = Cartesian3.distance(
      dragEvent.cartesianStart,
      dragEvent.cartesianEnd
    )
    if (dragEvent.distance === 0) {
      return
    }
    let projected = false
    try {
      projected =
        Cartographic.fromCartesian(
          dragEvent.cartesianStart,
          undefined,
          dragEvent.cartographicStart
        ) != null &&
        Cartographic.fromCartesian(
          dragEvent.cartesianEnd,
          undefined,
          dragEvent.cartographicEnd
        ) != null
    } catch (error) {}

    if (projected) {
      handler(dragEvent)
    }
  })
}
