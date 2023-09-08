import {
  BoundingRectangle,
  Cartesian2,
  Event,
  KeyboardEventModifier,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  type Scene
} from '@cesium/engine'
import { type SetOptional } from 'type-fest'

import {
  type ScreenSpaceSelectionEvent,
  type ScreenSpaceSelectionEventAction,
  type ScreenSpaceSelectionEventHandler
} from './ScreenSpaceSelectionEvent'

const pointEvent = {
  type: 'point',
  action: 'replace' as ScreenSpaceSelectionEventAction,
  position: new Cartesian2()
} satisfies ScreenSpaceSelectionEvent

const rectangleEvent = {
  type: 'rectangle',
  action: 'replace' as ScreenSpaceSelectionEventAction,
  startPosition: new Cartesian2(),
  endPosition: new Cartesian2(),
  rectangle: new BoundingRectangle()
} satisfies ScreenSpaceSelectionEvent

function actionForModifier(
  modifier?: KeyboardEventModifier
): ScreenSpaceSelectionEventAction {
  // TODO: How we can determine meta key is pressed?
  return modifier === KeyboardEventModifier.SHIFT ? 'add' : 'replace'
}

export class ScreenSpaceSelectionHandler {
  readonly indeterminate = new Event<ScreenSpaceSelectionEventHandler>()
  readonly change = new Event<ScreenSpaceSelectionEventHandler>()

  private readonly handler: ScreenSpaceEventHandler
  private startPosition?: Cartesian2

  disabled = false
  allowClickWhenDisabled = false

  constructor(readonly scene: Scene) {
    const handler = new ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction(this.handleClick, ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(
      this.handleClickWithModifier.bind(this, KeyboardEventModifier.SHIFT),
      ScreenSpaceEventType.LEFT_CLICK,
      KeyboardEventModifier.SHIFT
    )
    handler.setInputAction(this.handleMouseDown, ScreenSpaceEventType.LEFT_DOWN)
    handler.setInputAction(this.handleMouseUp, ScreenSpaceEventType.LEFT_UP)
    handler.setInputAction(
      this.handleMouseDown,
      ScreenSpaceEventType.LEFT_DOWN,
      KeyboardEventModifier.SHIFT
    )
    handler.setInputAction(
      this.handleMouseUpWithModifier.bind(this, KeyboardEventModifier.SHIFT),
      ScreenSpaceEventType.LEFT_UP,
      KeyboardEventModifier.SHIFT
    )
    this.handler = handler
  }

  destroy(): void {
    this.handler.destroy()
  }

  private handleClickWithModifier(
    modifier: KeyboardEventModifier,
    event: ScreenSpaceEventHandler.PositionedEvent
  ): void {
    this.handleClick(event, modifier)
  }

  private readonly handleClick = (
    event: ScreenSpaceEventHandler.PositionedEvent,
    modifier?: KeyboardEventModifier
  ): void => {
    if (this.disabled && !this.allowClickWhenDisabled) {
      return
    }
    pointEvent.action = actionForModifier(modifier)
    event.position.clone(pointEvent.position)
    this.change.raiseEvent(pointEvent)
  }

  private readonly handleMouseDown = (
    event: ScreenSpaceEventHandler.PositionedEvent
  ): void => {
    if (this.disabled) {
      return
    }
    this.startPosition = event.position
    this.handler.setInputAction(
      this.handleMouseMove,
      ScreenSpaceEventType.MOUSE_MOVE
    )
    this.handler.setInputAction(
      this.handleMouseMove,
      ScreenSpaceEventType.MOUSE_MOVE,
      KeyboardEventModifier.SHIFT
    )
  }

  private handleMouseUpWithModifier(
    modifier: KeyboardEventModifier,
    event: ScreenSpaceEventHandler.PositionedEvent
  ): void {
    this.handleMouseUp(event, modifier)
  }

  private readonly handleMouseUp = (
    event: ScreenSpaceEventHandler.PositionedEvent,
    modifier?: KeyboardEventModifier
  ): void => {
    if (this.disabled) {
      return
    }
    this.handleMouseMove({ endPosition: event.position }, modifier, false)
    this.startPosition = undefined
    this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.removeInputAction(
      ScreenSpaceEventType.MOUSE_MOVE,
      KeyboardEventModifier.SHIFT
    )
  }

  private readonly handleMouseMove = (
    event: SetOptional<ScreenSpaceEventHandler.MotionEvent, 'startPosition'>,
    modifier?: KeyboardEventModifier,
    indeterminate = true
  ): void => {
    if (this.disabled) {
      return
    }
    if (this.startPosition == null) {
      return
    }
    let x1 = this.startPosition.x
    let y1 = this.startPosition.y
    let x2 = event.endPosition.x
    let y2 = event.endPosition.y
    if (x1 > x2) {
      ;[x2, x1] = [x1, x2]
    }
    if (y1 > y2) {
      ;[y2, y1] = [y1, y2]
    }
    rectangleEvent.action = actionForModifier(modifier)
    this.startPosition.clone(rectangleEvent.startPosition)
    event.endPosition.clone(rectangleEvent.endPosition)
    rectangleEvent.rectangle.x = x1
    rectangleEvent.rectangle.y = y1
    rectangleEvent.rectangle.width = x2 - x1
    rectangleEvent.rectangle.height = y2 - y1
    if (indeterminate) {
      this.indeterminate.raiseEvent(rectangleEvent)
    } else {
      this.change.raiseEvent(rectangleEvent)
    }
  }
}
