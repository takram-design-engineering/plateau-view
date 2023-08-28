import { createMachine, type StateFrom } from 'xstate'

export type EventObject =
  | { type: 'SELECT' }
  | { type: 'HAND' }
  | { type: 'SKETCH' }
  | { type: 'STORY' }
  | { type: 'PEDESTRIAN' }
  | { type: 'MOUSE_UP' }
  | { type: 'MOUSE_DOWN' }
  | { type: 'PRESS_SPACE' }
  | { type: 'RELEASE_SPACE' }
  | { type: 'PRESS_COMMAND' }
  | { type: 'RELEASE_COMMAND' }
  | { type: 'WINDOW_BLUR' }
  | { type: 'WINDOW_FOCUS' }

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createToolMachine() {
  return createMachine({
    /** @xstate-layout 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-C3CfmIQ8qapjzH3kDlOGS3oQbpSIh0bM9NyG-mcfJc4uJEreA7qzeFj8aItUrrUGi2g3zrltCUGGdMGbJwhcENOqtBAQDIByrw6JnQulMKTIUyhpabm+GcfhjoKgLjZZ7UEkAOUulUIWF0bhcQbR4dLYwLxfSqsDErdZeApWGsYpzMBxKt4PydHaES5FNDZjNj+e4noHafDlgrIMKoXUow9hnNJ2zvW5IJh0QpuhgZGHhtHcslZlQ1iTgaxNRrWxtgySxbJP0fV5OBsSc1NF3BuDJVPHM3xsxKB4RRKixaoVTXhboVQFQ54JwdeE21u8HX+idfTXtmyxlepyRA+uphWhNHKKYJ0ZK6VhplpGx1itZ1xrdWzedyal24Nsa0WKWrjilHHSWBucdBotz6G3YMfggA */
    id: 'tool',
    type: 'parallel',
    states: {
      modal: {
        initial: 'selected',
        states: {
          selected: {
            initial: 'hand',
            states: {
              hand: {
                on: {
                  MOUSE_DOWN: '#tool.modal.active.hand'
                }
              },
              select: {
                on: {
                  MOUSE_DOWN: '#tool.modal.active.select'
                }
              },
              sketch: {
                on: {
                  MOUSE_DOWN: '#tool.modal.active.sketch'
                }
              },
              story: {
                on: {
                  MOUSE_DOWN: '#tool.modal.active.story'
                }
              },
              pedestrian: {
                on: {
                  MOUSE_DOWN: '#tool.modal.active.pedestrian'
                }
              },
              history: {
                type: 'history'
              }
            },
            on: {
              HAND: '.hand',
              SELECT: '.select',
              PEDESTRIAN: '.pedestrian',
              SKETCH: '.sketch',
              STORY: '.story',
              PRESS_SPACE: '#tool.momentary.selected.hand',
              PRESS_COMMAND: '#tool.momentary.selected.select'
            }
          },
          active: {
            initial: 'hand',
            states: {
              hand: {},
              select: {},
              pedestrian: {},
              sketch: {},
              story: {}
            },
            on: {
              MOUSE_UP: 'selected.history',
              WINDOW_FOCUS: 'selected.history',
              WINDOW_BLUR: 'selected.history'
            }
          }
        }
      },
      momentary: {
        initial: 'idle',
        states: {
          idle: {},
          selected: {
            initial: 'hand',
            states: {
              hand: {
                on: {
                  MOUSE_DOWN: '#tool.momentary.active.hand',
                  RELEASE_SPACE: '#tool.momentary.idle'
                }
              },
              select: {
                on: {
                  MOUSE_DOWN: '#tool.momentary.active.select',
                  RELEASE_COMMAND: '#tool.momentary.idle'
                }
              },
              history: {
                type: 'history'
              }
            },
            on: {
              WINDOW_FOCUS: 'idle',
              WINDOW_BLUR: 'idle'
            }
          },
          active: {
            initial: 'hand',
            states: {
              hand: {},
              select: {}
            },
            on: {
              MOUSE_UP: 'selected.history'
            }
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
    tsTypes: {} as import('./toolMachine.typegen').Typegen0
  })
}

export type ToolMachine = ReturnType<typeof createToolMachine>
export type ToolMachineState = StateFrom<ToolMachine>
