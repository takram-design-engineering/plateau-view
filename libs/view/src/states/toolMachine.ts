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
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2qA2A6WYNgGNlIAVdbAW1QgEMMBiAZQFEAZZgYRIG0AGAXUSgADqlgBLZONQA7ISAAeiALQBGAMzqsAJgAcAFn3aAnAFZ1Adgvrj2gDQgAnolUA2bVn0Xt61atParqa6rrqmAL7hDmiYOHiExBBksVS0DAASAIIAcgAifIJIIKISUrLySghqgVi66tq8pryWuhb6rtYOzghhWMYWpha8+gbqvKphkdHkcfhEpDOpdPQACgBKzIyMAPqMK5kczAXyJZLSckWVyvrDWK765jcjmhauql2Ioa53FhqujbxvEZtFMQDFsLg5olkpRqMtGABpZgkDjpY5FU5lC6gK4afR9Rr6Yy8e6NWwhD4IbRGLD+VQNIymenDUwRKJgmaQhILFJwhiMEgAeTWAE10SIxGdypcVPTjLULLpVCMSa1tHpTJTfFpTP9jLpiaYjMYvPpQeDZtykos+atmLlNiQ1gBJHLi4qSrEVWVMu5M3UGUzGDrq9RagxYcw2Px+PRGdSuc2c+Lza28tKrDZbbYcQUAWTzOXyAhOnvO3qqRlUWHUAUsqmsLzelKV1dUjXqw1CDf6SdiXNTMKwSwhKeQ9DzgoAqixtrlBQB1bLuzHlmVU3QeJluI0WfpWZqapwudyeby+fyBYKhNnTftjnmwtJYAAWNBkEAn09n86XK7L0o4ogegeNo7bts0iq-EqR7dL0-SDMMozjAYxh9qOUKPsOfI4AA1mAyAEC+X4zswc6LsuJYYgB2KKMBm6Rn4QRePuQy1pS1IeHSqjBsYPGBLwzToZag42s+sBoAATo4JE-hR-6lGuQEbluTHqAaYTqiYYbHgg2qRnqBqEiYprCQO0JiXQWDCJAcDIJJ4jvrJZG-pRhQSopgF0SpjFuOp+oBOqxg6d06n4lGfExnGPiJuyFrmVhVAUGAMjIDQ0n0Auzp5Iu2wAEKsFOawKVKtGVEqtKuPUDaaGBby6LolLmKBDXeMZPGAmZD5prCyWpelMlZTlC7bAAYoKHAziVXrrsorQ1qy2qXqEGlNfUOitf8rx6AmZpxcmmE9dhfVpdJr7vp+k6keRf5UR5pUVrVkaaMGli1poriuJSXw-BokWsky1JdYdQ5JSlp2OOdH70Bs7CZLOewHEcd0ep5ZUqA03wBICQx1LqvhGt96meH4IxeP4byNMDVqg6gJ0DSJ46w8w8NkbmBZFtNSnecooY6Noiq8A0YRVf4+iUq8pg1g8RLqbwuhC+oe13tgNBEOIABuYC0xmV2zlOKxc15lQmFjAXmCSlv0l9uleB4bQDNorJ1MCVjCWrUha7T9NnW+0N62RBtG+jentFg3jmK4wWvCEUcS00NaEsFwQ3OYqju+rXvkJl2W-vlhXFSjq7G-RvC1Ju3jafLDVVWtLUhAmrQxvLGee9r2dDXn42TYwwcVgL+Iah2+g8Q1cZNQ1WDjL4bWdq06iROyMjUHA8jgqWaMVsoTIWAtPi-I2ljNrpaivLUthWALfHBSE1OiZgG8PbN7TyrW+81U27wnwaU+cbw-TUnuHVO+Fl0x0EfjNZSahjDyiCBTQMwZK4hVlJGTiARDDyz8JuSY+17wg0shhBIEDuaVEsDoB4dQgjaiCAESkbgPB2wvAEIIIQcEq0ZolHCfsIDEJLggG4Co9xCyJFHRsJIWxSwQkMMmYwJi3g5HgmmBC8IESIrwkOSs+jX1lh0f4PEbbdE4rSQGwwnbMkMAvXBhD75Pisi+cQElUDSXURWfwtRqT6h8LWRCgRjCUnaPiPwL0WS6j+CAzh4kpLdHupA7yAiVSBDAiZQGrwtQaAMv-IyRoTJtHCUdEc1lbISQcu+Fx64GiJ0oe2Eyn0gwGMQGFZ60YooGBink724MBplKge2cORo3DeDqJoBs7QmowNpL8G49QfAjx4u0m0PtIbcO6XE6sgIiRmHGHbEM30Qi-QTACIE6p5m8kWYzFZpDd7UmCPUX4n1QhO3FrpVstIOwMm7HuCwrdNbtwftRTe65ArhzlICVpNhqSUjmq-C+9w2haTCLob5WcwEYAuYgRCwKTCgvjLYJ53Q1Dnz0Osm5niHhIt+bY6xyA0UICqlLIIzRsH6DCnik8XFIK6iaMSQSZKrFYA9j8nWdiLo0qqvKECIwqo+CDOpCRdxATKk8UaTsaE+UCuRZSlRhEXyis0DWYMUYeLAh8BxEe4dNz3FsB9CYQk1WZwpdhSJTjomoyfspKquhy4qgNPGKwaStD8WZVMjo8tNDkqFdgGyEA7IlNosXEO9VMXEkVDiiFulGk7lrHqAIupw0LM6c4-5brvJBmrCnYY6zAgPAsE1QSjFpltCtR9L5dq24dP6r7EVRbYmVDFZGAwFa4X3EGBPT108JheFeG4PakQgA */
    id: 'tool',
    initial: 'selectedTool',
    states: {
      selectedTool: {
        initial: 'modal',
        states: {
          modal: {
            initial: 'hand',
            states: {
              select: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.modal.select'
                }
              },
              hand: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.modal.hand'
                }
              },
              sketch: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.modal.sketch'
                }
              },
              history: {
                type: 'history',
                history: 'shallow'
              },
              story: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.modal.story'
                }
              },
              pedestrian: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.modal.pedestrian'
                }
              }
            },
            on: {
              SELECT: '.select',
              HAND: '.hand',
              PRESS_SPACE: 'momentary.hand',
              SKETCH: '.sketch',
              STORY: '.story',
              PEDESTRIAN: '.pedestrian',
              PRESS_COMMAND: 'momentary.select'
            }
          },
          momentary: {
            states: {
              hand: {
                on: {
                  MOUSE_DOWN: '#tool.activeTool.momentary.hand',
                  RELEASE_SPACE: '#tool.selectedTool.modal.history'
                }
              },
              select: {
                on: {
                  RELEASE_COMMAND: '#tool.selectedTool.modal.history'
                }
              }
            },
            on: {
              WINDOW_BLUR: 'modal.history',
              WINDOW_FOCUS: 'modal.history'
            }
          }
        }
      },
      activeTool: {
        states: {
          modal: {
            initial: 'hand',
            states: {
              select: {},
              hand: {},
              sketch: {},
              story: {},
              pedestrian: {}
            },
            on: {
              MOUSE_UP: '#tool.selectedTool.modal.history'
            }
          },
          momentary: {
            initial: 'hand',
            states: {
              hand: {
                on: {
                  MOUSE_UP: '#tool.selectedTool.momentary.hand'
                }
              }
            }
          }
        },
        on: {
          WINDOW_BLUR: 'selectedTool.modal.history',
          WINDOW_FOCUS: 'selectedTool.modal.history'
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
