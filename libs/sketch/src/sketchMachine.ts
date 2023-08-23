import { type Cartesian3 } from '@cesium/engine'
import { createMachine, type StateFrom } from 'xstate'

import { type GeometryType } from './types'

export type EventObject =
  | {
      type: 'CIRCLE'
      position: Cartesian3
    }
  | {
      type: 'RECTANGLE'
      position: Cartesian3
    }
  | {
      type: 'POLYGON'
      position: Cartesian3
    }
  | {
      type: 'NEXT'
      position: Cartesian3
    }
  | {
      type: 'EXTRUDE'
      position: Cartesian3
    }
  | { type: 'CREATE' }
  | { type: 'CANCEL' }

interface Context {
  lastPosition?: Cartesian3
  type?: GeometryType
  positions?: Cartesian3[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createSketchMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5SwNZgC4GMAWA6AlhADZgDEAwgJIBK5AMgKIDaADALqKgAOA9rPunw8AdpxAAPRAFoALAE4ATLgCMAdhYyFAVhYsAbCzkBmPTIA0IAJ6JVuI1tXKAHPYUutR5UaMBfHxdQMHAJiMmoGcgAVAEEAOQBxRlYOJBBefkERMUkEKQUZLVx8-TkZAzk5FgVqi2sEW3tHdzd7TxM-ALQsPEISUgAFAHk6AE14wdjksXSBIVFUnPsipz1qvVVVHS1Ko1qbOwdnV3c2vQ6QQO7cCAAnAEMAd3xhKAo48gY6KdSZzPnQHJuJR6JxOORaGSbVTVLRaPb1A5NY6tLxnfwXLrBW6PZ6vBgADUi1AAqgARZjsaZ8WZZBaIIxKBRGYxaNSbFjbKrwvQGIqwuQuGROeROBSqc6XLH3J4vXCYfA3TAka74O4AWwwYBupFiBMi3241L+2WkOmUuFUTlUemU2n0hhM5isiEhLFwpi8RkhMjZMna6MleGxMqguBuYEw6DuL2VkBgOr1BrSRrmJty+UKxWhApc4Kc8KM0NwVVZTmUHIUHJMWglmKD0txYYjUZjYFwTwg6GwCcJSd+qbp6YKRRkLGzoOZWnzzoQPLd2m2guFArFtaC9Zxst4REsUBEuAAblr0GBxD39ZSfinaQD6YzmfY2VtKgoC0WS85y1pKx49DWA3WuCnugNwAK4QLiFDhNEkQUikhoZAOt65EYY64IKlSrMKqjyE6dQrEYuA5raMLfqO-6dOuQHiCB4GQeQ7yfH217-BIiBAu6oLgpCDikdyvILgKXrLqKaLosIPAQHAYiBlSiE3mxuSqEscjKFo6xyBsIJWvCUhqTIxZGE46mWqKhZyGuVy9GAck0qxORSCCtiqSZmnWqCqi6TyuAeMZf5WtU5bKGilFXMGuK2cag5SA4BmqC5zibOUJjwl4jLaOUWmbF4llSpuobyoqJCRUhikxQoegWglVrqQ6ejwgoyhyBaC42vk0KoZCuUbiGcoKkqbYQeqmo3CVCkOZCThVWpiW1cYpgFmhpF6AyDjMsY3XXA2srhpG0ZQMVV7yfZ0gKMYI5jmdE55g1TUtbCbWQkyGjigBVHhTtzb7bG0A2UddlpnkaGxfIXqFisKxwjOqG2Mtq3KRUvhvWF22hrtLYHW2HZdmNJ3poY6G6M4VZ6KpbLwkKU3yNaLAmH++jOJtH2htuu4Kf243SGpFoGKYor5KUhjTnUjXNdCD22k9nWvaFeW9aze7CIex6nrjaamLgPo7Io7Kcq+0NLa18PrUjst4MBYEQS8avRZ45qsjy9jGYosLWvClqVYlGxmXITl+H4QA */
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
                      internal: true,
                      target: 'vertex',
                      actions: ['updatePosition']
                    }
                  }
                }
              }
            }
          },
          on: {
            CANCEL: {
              target: 'idle',
              actions: ['clearDrawing']
            },
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
              target: 'idle',
              actions: ['clearDrawing']
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
      actions: {
        createCircle: (context, event) => {
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'circle'
          context.positions = [position]
        },
        createRectangle: (context, event) => {
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'rectangle'
          context.positions = [position]
        },
        createPolygon: (context, event) => {
          const position = event.position.clone()
          context.lastPosition = position
          context.type = 'polygon'
          context.positions = [position]
        },
        clearDrawing: (context, event) => {
          delete context.lastPosition
          delete context.type
          delete context.positions
        },
        updatePosition: (context, event) => {
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
