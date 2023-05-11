import { createMachine } from 'xstate'

export interface Context {}

export const SELECT = 'SELECT'
export const HAND = 'HAND'
export const DRAWING = 'DRAWING'
export const MOUSE_UP = 'MOUSE_UP'
export const MOUSE_DOWN = 'MOUSE_DOWN'
export const PRESS_SPACE = 'PRESS_SPACE'
export const RELEASE_SPACE = 'RELEASE_SPACE'

type EventObject =
  | { type: typeof SELECT }
  | { type: typeof HAND }
  | { type: typeof DRAWING }
  | { type: typeof MOUSE_UP }
  | { type: typeof MOUSE_DOWN }
  | { type: typeof PRESS_SPACE }
  | { type: typeof RELEASE_SPACE }

export const sketchStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwNZgC4GMAWA6WYANmJupACoD2lhuAtpRAIaEDEAygKIAynAwuQDaABgC6iUAAdKsAJbpZlAHYSQAD0QBaAIwBmXbl0AOE0YCsAdl0BOAEwAWI7oA0IAJ6IHZ3Ge32zAGwB2gFWtrZGAL6RrqgYOPhEJGQQVDT0jCysABIAggByACIi4kgg0nIKyqoaCDq2AbgBuvbWRsLCpmb22rauHgi6vU0W1tZmwtrC1vYB1tGxaFh4BMSkFNS0DMxsAAoASpzs7AD67Lu5fJwlqhXyiipltZq2bbivwroBHX4BDdr9RBzRr6IK6CxOIZGay6BYgOLLRJrFJpLaZNiFfa5ADqAEl8gBxG5lO5VR6gZ5+YRNawWeyjKZ-IyjCyAwZGbS4azBCLaPnaCFzMxwhEJVbJDbpbYsJHJVgAWQA8gBVLgnQqK7H5YlSGT3apPTxGWy4ezCCwC9qhFoA9yefw+PyBYLW8JRGLwpZipLrVKbDI7XDYJhKCAKlVqjVanXlPVkmpGk1mi1-Om6WzCMzctlDE2hMYBbqg4T2EVelY+lH+6W0CAAJyYAHdZEooOHVZx1ZrtWJbnGHgmEBEk+bLcJrWbs3b2Zzub0OfzBeMy-EK8jJWi6GAlOgmHW3EGQ2GlR2u9HeyT+waKYh9CazPpueDdA+vgE2QEjI1QnprHyzABvSlh6oprhKfpSpQW47nuB7BqGrCHLwuRquclzXBeuqVAOhp1NoJiGGYthDMYJbGNo3QfuCTSMvYDi6CWRYroiTCkLIABuYCogGWQnmqyq7DGpI4TeQ7cj4bQAQx3zfL077TvSJp0hYREAU4dG2BYFjMQkrEKJx3EMNBu77oeCF8Z2AlCVe5LqLesy4BYtgPnM4KfkE1hsip1IMd0MJmEYZoPto0QekojBwKooF9th152XUNj2O81ifN8kyzP8bI6I0kn2HReWjH+UzCiB5ayr6qIxfqtnPC0jQfF8PwZcEXnUr4-h0pMaZEbYOlgRV1bolV8a4ToBFzMpf7jhELJshRRi4OlgT0Z8-59eVVaQYG4qkMNInxdRfi-p+vzSWYbJeI6-gTIFUIQutO2bWigbwRAe1xbUPSLXSYwTH4Tk-jmwz5m05qWFYf4PZWG48bWDbNq2701Z41i4OYxFCiyDR9NO5FcjyC58hC2mlauG0wzWQayLA6CUPuSODhRaMOG0xEvpYwgNJ5CkBElfKPoxgR6AEUPrhBm7biZAxYdVg6aDlzkdK06NhE4bJZqjAp6D0IRTHSvWk4ij0U1BkuwWZb2XrFyMIF95qtOM6UA05H5fiMwuZuaDjhOtekcVxmwM7hr64NrqUtGMzJGF5FjvERJYCpYFGwobulsQZg07EHokBZyYdfBHbQQnNvOOfHDECh0rwp4sZN+xnW0yo92fxc0jR0UMfj2EMnyvBdRFxxm+EBR8am++nAeN7Qr0t7UvM+c6tLSWMNhA3mhXtCpWk2CFqd4PXk-PTK9ZNi2UCz0Cryhy04cO1HOYcvj878paQrj-ph8ZMZsEXwgWYmi+a05oe52BxgMRw3gTDjBfL0VaWZ37+0MqbGCpkZ5W1lrheehEgFWCmKA9WVhDDQgAnlIIjgbChUiEAA */
  id: 'sketch',

  states: {
    selectedTool: {
      initial: 'modal',
      states: {
        modal: {
          initial: 'hand',
          states: {
            select: {
              on: {
                [MOUSE_DOWN]: "#sketch.activeTool.modal.select"
              }
            },
            hand: {
              on: {
                MOUSE_DOWN: "#sketch.activeTool.modal.hand"
              }
            },
            drawing: {
              on: {
                MOUSE_DOWN: "#sketch.activeTool.modal.drawing"
              }
            },
            history: {
              type: 'history',
              history: 'shallow'
            }
          },
          on: {
            [SELECT]: '.select',
            [HAND]: '.hand',
            [PRESS_SPACE]: 'momentary.hand',
            [DRAWING]: '.drawing'
          }
        },
        momentary: {
          states: {
            hand: {
              on: {
                [MOUSE_DOWN]: "#sketch.activeTool.momentary.hand",
                RELEASE_SPACE: '#sketch.selectedTool.modal.history'
              }
            }
          }
        }
      }
    },

    activeTool: {
      states: {
        modal: {
          states: {
            select: {},
            hand: {},
            drawing: {}
          },

          initial: "select",

          on: {
            MOUSE_UP: "#sketch.selectedTool.modal.history"
          }
        },

        momentary: {
          states: {
            hand: {
              on: {
                MOUSE_UP: "#sketch.selectedTool.momentary.hand"
              }
            }
          },

          initial: "hand"
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
  tsTypes: {} as import('./sketchStateMachine.typegen').Typegen0,

  initial: "selectedTool"
})
