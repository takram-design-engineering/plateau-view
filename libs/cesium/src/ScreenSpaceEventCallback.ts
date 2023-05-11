import {
  type ScreenSpaceEventHandler,
  type ScreenSpaceEventType
} from '@cesium/engine'

// prettier-ignore
type EventTypeMap = [
  [ScreenSpaceEventType.LEFT_DOWN, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.LEFT_UP, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.LEFT_CLICK, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.LEFT_DOUBLE_CLICK, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.RIGHT_DOWN, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.RIGHT_UP, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.RIGHT_CLICK, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.MIDDLE_DOWN, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.MIDDLE_UP, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.MIDDLE_CLICK, ScreenSpaceEventHandler.PositionedEventCallback],
  [ScreenSpaceEventType.MOUSE_MOVE, ScreenSpaceEventHandler.MotionEventCallback],
  [ScreenSpaceEventType.WHEEL, ScreenSpaceEventHandler.WheelEventCallback],
  [ScreenSpaceEventType.PINCH_START, ScreenSpaceEventHandler.TwoPointEventCallback],
  [ScreenSpaceEventType.PINCH_END, ScreenSpaceEventHandler.TwoPointEventCallback],
  [ScreenSpaceEventType.PINCH_MOVE, ScreenSpaceEventHandler.TwoPointMotionEventCallback],
]

export type ScreenSpaceEventCallback<T extends ScreenSpaceEventType> = {
  [K in keyof EventTypeMap]: EventTypeMap[K] extends [T, infer U] ? U : never
}[keyof EventTypeMap]
