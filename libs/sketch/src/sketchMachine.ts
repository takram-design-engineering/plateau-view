import { type Cartesian2, type Cartesian3 } from '@cesium/engine'
import invariant from 'tiny-invariant'
import { createMachine, type StateFrom } from 'xstate'

import { type GeometryType } from './types'

export type EventObject =
  | ((
      | { type: 'CIRCLE' }
      | { type: 'RECTANGLE' }
      | { type: 'POLYGON' }
      | { type: 'NEXT' }
      | { type: 'EXTRUDE' }
    ) & {
      pointerPosition: Cartesian2
      position: Cartesian3
    })
  | { type: 'CREATE' }
  | { type: 'CANCEL' }

interface Context {
  lastPointerPosition?: Cartesian2
  lastPosition?: Cartesian3
  type?: GeometryType
  positions?: Cartesian3[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createSketchMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5SwNZgC4GMAWA6AlhADZgDEAwgJIBK5AMgKIDaADALqKgAOA9rPunw8AdpxAAPRAFoALAE4ATLgCMAdhYyFAVhYsAbCzkBmPTIA0IAJ6JVuI1tXKAHPYUutR5UaMBfHxdQMHAJiMmoGcgAVAEEAOQBxRlYOJBBefkERMUkEKQUZLVx8-TkZAzk5FgVqi2sEW3tHdzd7TxM-ALQsPEISUgAFAHk6AE14wdjksXSBIVFUnPsipz1qvVVVHS1Ko1qbOwdnV3c2vQ6QQO7cCAAnAEMAd3xhKAo48gY6KdSZzPnQRYKWymBx6PTKORg5T6PYIeyFLw6GQyIxOZQ6OSqc6XYK3R7PV7kd6fJjKFLcPizLILRBGFEqVSeDxOHTKNawqSqOS4TEsDamdZORwyLH+C5dXH3J4vUgMAAakWoAFUACLMdjTSl-bK0pQKIzGLRqTYsbZVWFglhFLTbFwyJzyJxA7ESvB46VQXCYfA3TAka74O4AWwwYBupFi8si3wpGTmOtyrNwqiF4O0+kMJnMVkQIqtpi8dNUMmNKLOYpxbqlBNwNzAmHQdxe-sgMAjUZjaS18ZpuXyhWKqgUcicLjkWicsKMQ9wVSNaNNClNJi0LqCVfxL1r9cbzbAuCeEHQ2HbCs7vx7AOk-aKMj5w9HBonFoM1ttdIdI+dFdd12rW94IhLCgERcAANzDdAwHEU9ow1H5u2pK84T1A17GNLZKgUKcZznZxoS0JcPD0Vcf3XXBoPQG4AFcIAJChwmiSJ1XJLs4yQiRpCMPlcDtSpVgdYtSlhFYjB5Uc2WqG1ilIzpyMomi6JlIlYg+L54NjKl-k4hA3CUPRR3HEUHCkrQXytbR33tR0FHLMVhB4CA4DEStNXY7Sck5ExeIqFZh3WVQDF2HNcmUdZcDzFNpz5SoS3LOSrl6MA3K0hMpAMpwfJHVZIX5FhgrqKQtD0XAjVMJ8SyHU1RQSyVNygFLtV7Iri2TOR0WcTZyhMWEvD1bRViMIEChZWTxXI90a29X0SEay8dKK2y2o6oViszPRYQUCFk0s4xbO2RRNDXK5Jq3aa-X3Ojg1DG45o4zyRUyrkVq69bszqbjbFMvQhocA1jGOuqPW3BsmygWaEPctLhzEwcHzHZ8Qq27khxtPaSIqfIFEBjdgbrUG9wo6Bksh1LmqXWwHGRYwURTAySKnHjvt+xkKl8MiTv-T18d3cH90PY87o869DF43RnGXPR2uNWF7Uy+RAvysEdHBJwcb-ercEA4COIve7pHRZMDFMJ18lKQxJyR7bUe2IaMcO7GOaBmttZA4RwMg6ChYTUwIohfLFBNM1sJCz6iksn7tFZgGndxmtsHwWB0B4G46k0prkLcTKvHyqrHH0NR3sQDxCnylEXCXFZiPVhTaIJb3ms8ZRSrCn6J22SzAthOmVCFDYnQNAzRT8IA */
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
              initial: 'diameter',
              states: {
                diameter: {
                  on: {
                    NEXT: {
                      target: '#sketch.extruding',
                      actions: ['updatePosition']
                    }
                  }
                }
              }
            },
            rectangle: {
              initial: 'edge',
              states: {
                edge: {
                  on: {
                    NEXT: {
                      target: 'width',
                      actions: ['updatePosition']
                    }
                  }
                },
                width: {
                  on: {
                    NEXT: {
                      target: '#sketch.extruding',
                      actions: ['updatePosition']
                    }
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
                      actions: ['updatePosition']
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
            ],
            EXTRUDE: {
              target: 'extruding',
              actions: ['updatePosition']
            }
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
          return context.positions != null && context.positions.length > 1
        }
      },
      actions: {
        createCircle: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'circle'
          context.positions = [position]
        },
        createRectangle: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'rectangle'
          context.positions = [position]
        },
        createPolygon: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'polygon'
          context.positions = [position]
        },
        popPosition: (context, event) => {
          invariant(context.positions != null)
          invariant(context.positions.length > 1)
          context.positions.pop()
        },
        clearDrawing: (context, event) => {
          delete context.lastPosition
          delete context.type
          delete context.positions
        },
        updatePosition: (context, event) => {
          context.lastPointerPosition = event.pointerPosition.clone()
          const position = event.position.clone()
          context.lastPosition = position
          context.positions?.push(position)
        }
      }
    }
  )
}

export type SketchMachine = ReturnType<typeof createSketchMachine>
export type SketchMachineState = StateFrom<SketchMachine>
