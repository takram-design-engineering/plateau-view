import { type BoundingRectangle, type Cartesian2 } from '@cesium/engine'

export type ScreenSpaceSelectionEventType = 'point' | 'rectangle'
export type ScreenSpaceSelectionEventAction = 'replace' | 'add' | 'remove'

interface ScreenSpaceSelectionEventBase {
  type: ScreenSpaceSelectionEventType
  action: ScreenSpaceSelectionEventAction
}

export interface PointScreenSpaceSelectionEvent
  extends ScreenSpaceSelectionEventBase {
  type: 'point'
  position: Cartesian2
}

export interface RectangleScreenSpaceSelectionEvent
  extends ScreenSpaceSelectionEventBase {
  type: 'rectangle'
  startPosition: Cartesian2
  endPosition: Cartesian2
  rectangle: BoundingRectangle
}

export type ScreenSpaceSelectionEvent =
  | PointScreenSpaceSelectionEvent
  | RectangleScreenSpaceSelectionEvent

export type ScreenSpaceSelectionEventHandler = (
  event: ScreenSpaceSelectionEvent
) => void
