import { createMachine, type StateFrom } from 'xstate'

export interface Context {}

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createToolMachine() {
  return createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2qA2A6WYNgGNlIAVdbAW1QgEMMBiAZQFEAZZgYRIG0AGAXUSgADqlgBLZONQA7ISAAeiALQBGAMzqsAJgAcAFn3aAnAFZ1Adgvrj2gDQgAnolUA2bVn0Xt61atParqa6rrqmAL7hDmiYOHiExBBksVS0DAASAIIAcgAifIJIIKISUrLySghqgVi66tq8pryWuhb6rtYOzghhWMYWpha8+gbqvKphkdHkcfhEpDOpdPQACgBKzIyMAPqMK5kczAXyJZLSckWVyvrDWK765jcjmhauql2Ioa53FhqujbxvEZtFMQDFsLg5olkpRqMtGABpZgkDjpY5FU5lC6gK4afR9Rr6Yy8e6NWwhD4IbRGLD+VQNIymenDUwRKJgmaQhILFJwhiMEgAeTWAE10SIxGdypcVPTjLULLpVCMSa1tHpTJTfFpTP9jLpiaYjMYvPpQeDZtykos+atmLlNiQ1gBJHLi4qSrEVWVMu5M3UGUzGDrq9RagxYcw2Px+PRGdSuc2c+Lza28tKrDZbbYcQUAWTzOXyAhOnvO3qqRlUWHUAUsqmsLzelKV1dUjXqw1CDf6SdiXNTMKwSwhKeQ9DzgoAqixtrlBQB1bLuzHlmVU3QeJluI0WfpWZqapwudyeby+fyBYKhNnTftjnmwtJYAAWNBkEAn09n86XK7L0o4ogegeNo7bts0iq-EqR7dL0-SDMMozjAYxh9qOUKPsOfI4AA1mAyAEC+X4zswc6LsuJYYgB2KKMBm6Rn4QRePuQy1pS1IeHSqjBsYPGBLwzToZag42s+sBoAATo4JE-hR-6lGuQEbluTHqAaYTqiYYbHgg2qRnqBqEiYprCQO0JiXQWDCJAcDIJJ4jvrJZG-pRhQSopgF0SpjFuOp+oBOqxg6d06n4lGfExnGPiJuyFrmVhVAUGAMjIDQ0mvu+n6TqR5F-lRHlSrRlSaFumjBpYtaaK4riUl8PwaJFrJMtSZkPmmsLJal6WOJlH70Bs7CZLOewHEcBUep5xUqA03wBICQx1LqvhGnV6meH4IxeP4byNG1mEddhXVpRl5kDWwzDDWRuYFkWClFRWyihjo2iKrwDRhK4K36JSrymDWDxEupvC6O96hmnFMw0EQ4gAG5gEOI7OdsU4rPdXrriYc0BeYJJ4-StW6V4HhtAM2isnUwJWMJ0NSPDiOoMdPV9dl35kaj6NKd54PfN45iuMFrwhALv1NDWhLBcENzmKo+1WgzTPSfQC7Onki7bAAQqwU5rJzXmVLwnh8bYrzk8FDYgxYlLmB47S1qD+g2K91iROyMjUHA8jgqWU2PUyFg1nWvyNpYza6WoryRtSYx7sq4PvbocuiZgPsPeu1wC4HPjB5oofvOHBpYO9jsktF9KJ5D94HQzaSpxjylqMY8pBDtgbBt4PiUmoUcl+0RogzL6hJxZ6ZWeZddcyVAfUsECaD0EASUm4tvnn4ARBCEkyVxh8uWdgb4fhP+uIDcCp7sXvGNiSLb-QhQxbWMEy3hyVe76PEL4YRL5H9Nen4k3PEgYdH+DxQm3ROK0hasMcmzJDBD23iJEeT4rIvnEBJVA0kf4Vn8LUak+ofC1kQoEYwlJ2j4j8OVFkuo-jD0SjhdBmDqK+3XKfFUgQwImRaq8LUGgDK8H1IaY0pkEEJUOiOaytkJIOXfFgzGhsxh1F2iZGqQYwGIDCpGcqMZy7xlineHeydOopROt0Qq9dvJqENgMfQbhvB1E0A2do1sm60l+DYTcfgm5fVoWIxmxjmYHwgLI5SNii5tCbk0ZU3gQx1RCA1BMAIgTqh8Qrfxp0xzBO5tPB4dRXpuBqpuVaulWy0g7Aybse4LA0xhvTcgmTKh1k8GEXUe4iQGEaF3QuxcxjuAMBwiu+isC0zhgjPe9TECDGrCMVkHQTT6mll3asARe7MQHtqapdNRnv0QeMhAX1vjxmgWYOUYEl6nmJhede14t6DOGbU7ZgTdmkiLqyZU9xfDQJvn0AY99kJPw2SMmuY9P5ESeeDWkAseKaHGB0DpukIF0gZDAhk7QAX3OQRCKSpjJpp2Ul9Zugx2jEjaeTewul9K6n4UZI0Jk2hoq2RiiREA7LSNoquY+eyeJNJma0+ZcLQoRgito6KENbk1IZUdNJ2L2W-yDB4WssKB6CWCroa2glahKisOEsIXZ6WpO6hlR5TDcXeWeQqoYSr+HqWtroXQNZNU2D3JYJoENIhAA */
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
              WINDOW_BLUR: 'modal.history'
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
