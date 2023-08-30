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
      position: Cartesian3
    })
  | { type: 'CREATE' }
  | { type: 'CANCEL' }

interface Context {
  lastPointerPosition?: Cartesian2
  lastPosition?: Cartesian3
  type?: SketchGeometryType
  positions?: Cartesian3[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createSketchMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5SwNZgC4GMAWA6AlhADZgDEAwgJIBK5AMgKIDaADALqKgAOA9rPunw8AdpxAAPRAFoALAE4ATLgCMAdhYyFAVhYsAbCzkBmPTIA0IAJ6JVuI1tXKAHPYUutR5UaMBfHxdQMHAJiMmoGcgAVAEEAOQBxRlYOJBBefkERMUkEKQUZLVx8-TkZAzk5FgVqi2sEW3tHdzd7TxM-ALQsPEISUgAFAHk6AE14wdjksXSBIVFUnPsipz1qvVVVHS1Ko1qbOwdnV3c2vQ6QQO7cCAAnAEMAd3xhKAo48gY6KdSZzPnQRaOXCqGQFIxydQyFhGFiqXZWRD2GS4baeeRGVQQxRac6XYK3R7PV7kd6fJjKFLcPizLILREyIwqOHKDxOHTKNZ7XKY3AQ2GqUzrJyOGSqXFdfH3J4vUgMAAakWoAFUACLMdjTal-bKIpQKcH2NSbFjbKpcvQGIpabYuGROeROBRi-wXCV4AnSqC4TD4G6YEjXfB3AC2GDAN1IsXlkW+VIycx1uXZwOFeg5OnKJnMCIQopYuFMXiMopkRoZZxdePdUqJ3t9-rAgZDYYjJNiHy+Gp+WoTdO5Tnzcj0lQhCmHCiqWi5aiULCcLM8c4cJuq4qC1cJL1wNzAmHQdxeAcgMEj0djaR7tIB0i8yiK3m8ymUGjnjoUXIxd4q+oZQ6c9pNGQ1yuD1ax3PcDygI9oDINsO3PX5e2vftB2HQxVDHRRJy5FpgXBOQHFLYwjH-YDJU3L1wP3Q9GyeCB0GwU8FQQy9-gkaRH3vGFwVBYU7T0c1LW0G1i3tORHWdTp12uGstyoyCAzohi3nbMkuzjGk2JyPJVgLFx7SfHj528D8gW-YtwT0f8oS0IDKzdGSKNwXgiEsKARFwAA3cN0DAcQmJjdSL3jK92IQLw9QUZRKgFe0CgqJxTK-RRiwMIwnXQsi8D89AbgAVwgIkKHCaJInVSlgs0xMpBhWxbUqVZ7RBUouRWRlxPnaphOKHF7OknL8sKmU4LUirENCxYVlwUVxLKZQrItJ0uXUOQURMSpov1AdepdYQeAgOAxCrTUQq06RHScXk0NHcdsJzKR5tsPMNgu0xuKykISBOqq+ykKzLqcBLViHDY0q5KQtD0FF5t-WyZxNSTXWk0CXm+7VfsI4E5BZZxNkzAScwilRFAw7QMX0NkKykkDZK9H0-S+7tTuqrQxyxnHhUhwwTBw6LgWEgdjHUdReup8jPTrBnG0K5tfJuNGkLC2RVEuzEObx7nTA-WEimEvR0ocfDfD6mmnPkmiFYmjjnz0kjSy8UpjPhOootW8cQRI1lCI+lHKN3aioMbY8wEts7cmMFF1kMMoHAS4VtdsTaMLTEFnFWH3ae3f2FNowgGND6qCKxp1502SFosSnM7UuspRQtLR53tFYqaR02JZctzQvGsP7V16LYSs0FtnE3m3ZJ+KjTHWyM6cjv3OELyfL8gu+xh6aWBZAjnCHhKE+Jp03C2k0PDssWNwl7B8FgdAeBuOoNPR5CSMup8FBJ8SNFWVQuQ8QpdBZO0zhjCZRNsEAaBUiQr2QjVJ80MLT2DZNiBwBM6gqyhrjF6+o-zOj8EAA */
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
                    },
                    CANCEL: {
                      target: '#sketch.idle',
                      actions: ['clearDrawing']
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
                    },
                    CANCEL: {
                      target: '#sketch.idle',
                      actions: ['clearDrawing']
                    }
                  }
                },
                width: {
                  on: {
                    NEXT: {
                      target: '#sketch.extruding',
                      actions: ['updatePosition']
                    },
                    CANCEL: {
                      target: 'edge',
                      actions: ['popPosition']
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
