import { type Cartesian2, type Cartesian3 } from '@cesium/engine'
import invariant from 'tiny-invariant'
import { createMachine, type StateFrom } from 'xstate'

import { type SketchGeometryType } from './types'

export type EventObject =
  | ((
      | { type: 'CIRCLE' }
      | { type: 'RECTANGLE' }
      | { type: 'POLYGON' }
      | { type: 'NEXT' }
      | { type: 'EXTRUDE' }
    ) & {
      pointerPosition: Cartesian2
      controlPoint: Cartesian3
    })
  | { type: 'CREATE' }
  | { type: 'CANCEL' }

interface Context {
  lastPointerPosition?: Cartesian2
  lastControlPoint?: Cartesian3
  type?: SketchGeometryType
  controlPoints?: Cartesian3[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createSketchMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5SwNZgC4GMAWA6AlhADZgDEAwgJIBK5AMgKIDaADALqKgAOA9rPunw8AdpxAAPRAFoALAE4ATLgCMAdhYyFAVhYsAbCzkBmPQBoQAT0SrcRrauUAOOwudajyhXoC+386gwcAmIyagZyABUAQQA5AHFGVg4kEF5+QRExSQQpBWUZWxYjVRldDQUNR0dzKwQbfVctRxYtTyMFDrlffzQsPEISUgAFAHk6AE04kZiksTSBIVEU7OVdXGc5LUUZUpZHDuUa61t7Jxc3DwUuvxAAvtwIACcAQwB3fGEoCljyBjpZlLzDJLUDZYrKXAlGTuOTqUpGFiqIxHBAeOTrTTuVRaBQlbSI7q3XpBJ5vD5fcg-P5MZTJbh8BaZZaIdrouT5YpGdktIwmGQoqSqNmrUqaXFndqEu4kl7vT64TD4R6YEi4ABuYEe6DA4lIMQYAA0IgD6elFllpDoWLgtnoKkZHOpHQp+ZZEDs9Lgxe0WGpsVpSqopcS8KS5VBcI8wJh0M9PqqNVqdXrDcb2HMGcCLTlXNbijtEaVcXJHa7ajojF6FB5RR5VA4fDdpaHZeTI9HY-GwOrNdrdfqjTS6alM+bmTmZJW9hy5IG9DInNU3aj2bgDA7fa19Mo9EYZMHAi2yfLeEQLFARD2k-3UyaR2amaDECXcCWF-lHGcWHlkcuuRD12aZQtz0Hd9ybEMHlbE8eDPC9hCvPtSFTagAFUABFmHTQFR0fCRn0cV9HHfPRFFcVQXTMZcmnRfZVEcedHC0LQ9BY64ekPXAdXQR4AFcIHJCgwiiCIsOHIExyfHJ2k9TZYXo7E0TUFFVF3G0dE2Bo5HZPQgwgzjuL4gTPm+GJfn+bDTUZEF8IQSclF9TdPA05QuRRPQDFwbQtmcGRiJLLxfBuYQeAgOAxGbDMHxs7JBRMdZtIYq5dNUooBR3GwFw0DR3CufZlAPe4BjAKLrOzKQ9CqBKSztOQUvXAUWJtMCuQDNQKnsQqZWPKBSqzccpBYrQ10RRQmKcZQ1DkFFXIhMi1GKKpeXncCOPuMM20VZUSD6yTbMGtQRqFRoJqmlE8nRUivGIvJdwXOwuqPcMFSVFVu0TPtdrw2KZFIo6xtaT8zr-REVEUK7dw8Jp9EeqCevbGM4ygHacOi8qrghadJ1nRF52Uablwuqs8n2DrgKh2GNvlKNEa7RCdS+mLpCcGxXNA6sP1nUCl1qBFZIOJo-UcEtgMp6CI1Pc88Ik77EB0Ij3z8r8f3O-G10UBwAraJi9LW7rnsl+D6eyKz+qkzw2Qohd4UhxEUQRVmNdcatmmYowxfh7B8FgdAeEeWpTb27JJ0rAx6JdZjDDDlFfsIj8qlhTwrmYxs9bwQz+PJRnysuV8HHkLkHQ8vYy0QSrK2rbzGLkLSgu8IA */
      id: 'sketch',
      initial: 'idle',
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      context: {} as Context,
      states: {
        idle: {
          on: {
            CIRCLE: {
              target: 'drawing.circle',
              actions: ['createCircle']
            },
            RECTANGLE: {
              target: 'drawing.rectangle',
              actions: ['createRectangle']
            },
            POLYGON: {
              target: 'drawing.polygon',
              actions: ['createPolygon']
            }
          }
        },
        drawing: {
          states: {
            circle: {
              initial: 'vertex',
              states: {
                vertex: {
                  on: {
                    NEXT: {
                      target: '#sketch.extruding',
                      actions: ['pushPosition']
                    }
                  }
                }
              }
            },
            rectangle: {
              initial: 'vertex',
              states: {
                vertex: {
                  on: {
                    NEXT: [
                      {
                        target: '#sketch.extruding',
                        cond: 'willRectangleComplete',
                        actions: ['pushPosition']
                      },
                      {
                        target: 'vertex',
                        internal: true,
                        actions: ['pushPosition']
                      }
                    ]
                  }
                }
              }
            },
            polygon: {
              initial: 'vertex',
              states: {
                vertex: {
                  on: {
                    NEXT: {
                      target: 'vertex',
                      internal: true,
                      actions: ['pushPosition']
                    },
                    EXTRUDE: {
                      target: '#sketch.extruding',
                      actions: ['pushPosition']
                    }
                  }
                }
              }
            },
            history: {
              type: 'history'
            }
          },
          on: {
            CANCEL: [
              {
                target: '.history',
                cond: 'canPopPosition',
                actions: ['popPosition']
              },
              {
                target: 'idle',
                actions: ['clearDrawing']
              }
            ]
          }
        },
        extruding: {
          on: {
            CREATE: {
              target: 'idle',
              actions: ['clearDrawing']
            },
            CANCEL: {
              target: 'drawing.history',
              actions: ['popPosition']
            }
          }
        }
      },
      schema: {
        events: {} as unknown as EventObject
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/consistent-type-imports
      tsTypes: {} as import('./sketchMachine.typegen').Typegen0
    },
    {
      guards: {
        canPopPosition: (context, event) => {
          return (
            context.controlPoints != null && context.controlPoints.length > 1
          )
        },
        willRectangleComplete: (context, event) => {
          return (
            context.controlPoints != null && context.controlPoints.length === 2
          )
        }
      },
      actions: {
        createCircle: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const controlPoint = event.controlPoint.clone()
          context.lastControlPoint = controlPoint
          context.type = 'circle'
          context.controlPoints = [controlPoint]
        },
        createRectangle: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const controlPoint = event.controlPoint.clone()
          context.lastControlPoint = controlPoint
          context.type = 'rectangle'
          context.controlPoints = [controlPoint]
        },
        createPolygon: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const controlPoint = event.controlPoint.clone()
          context.lastControlPoint = controlPoint
          context.type = 'polygon'
          context.controlPoints = [controlPoint]
        },
        pushPosition: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const controlPoint = event.controlPoint.clone()
          context.lastControlPoint = controlPoint
          context.controlPoints?.push(controlPoint)
        },
        popPosition: (context, event) => {
          invariant(context.controlPoints != null)
          invariant(context.controlPoints.length > 1)
          context.controlPoints.pop()
        },
        clearDrawing: (context, event) => {
          delete context.lastControlPoint
          delete context.type
          delete context.controlPoints
        }
      }
    }
  )
}

export type SketchMachine = ReturnType<typeof createSketchMachine>
export type SketchMachineState = StateFrom<SketchMachine>
