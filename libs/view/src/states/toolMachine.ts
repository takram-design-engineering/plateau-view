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
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2qA2A6AtqiAhtrGBmAMbKQDEAEgIIByAIgNoAMAuoqAA6qwAlskGoAdjxAAPRAFoArAGYA7FgAsAJgCMATkUA2bex3z2igDQgAnoi1Gs7eXacAOLS8XyNygL4-LaJi4+ERYJGSUNADKAKIAMjEAwgAqHNxIIPxCIuKSMggKampYWsryLmpKLk76WhbWtho67FguOvouGkrKeuxmfgHo2HiExKQUVBDUAAoxzDFRyQBKAJJMaZJZwqISGfkKhljyaorsWuz6F2fyOpY2CHXKWlhdOs3Kymr6RfqKAyCBYYhMYRSbUKIAaRiyUStA2GS2OV2oH2x3kWB6+l6phcFU6d1sRR0L1+ii63i+F3+gOCozC40iU0WAHklgBNeF8ATbXJ7OTHFrKLHlXGnPTeAkPJQtIpFUrHU7KdhqalDWmhcITGjTJYLKIAfSi03oiRinMy3KReTkFWKahMGg030UnnY1UlGmM+gxalKF2UFQuf38ALVIw1DLBOr1+sSzIAsvGmGwuJtLTtrQUXLUXuxHYZPrbbg0ENoA1hfqY1I5dAYNKqguGQVqIFgABYEMRTePMgCqsX1zGZAHVGObERm+QVHlgXS6dFpfW1lNp9JK7OcHE5vEpK10G0C6ZrGfTQdQe-2YoOR2PUwj07yUXIZ3PFAulzoV1o1yW7M1Wu0bSXIubgfAe6rNiesAANZgMg5BtuefYDkOo7jg+yLSM+Kizi6vr2t8i5fOuRIki6ZwrjoJyKC44FNqeLZhGgABOVhIZe15oXeXLZJOT7TgYWCfjoHhPMYnhNMW9xaNK6iyr6bqdJovghjS9HHpMWC8JAcDIMxgiduxKE3uhvGPlhAmqK+77uJ+q7riozyvLimhnN4Kh0cCWAEJQggAG5gEZV69tMpk8ph+x2IoJS+u0XR4Ro1YaOutTeuwnyfB0SrnMcnl0j5IgBdQw4rCwI76gAYsyiT9mFVpTrI7gaEcToaKcuJeNUTrrkqLTVGUTgqPI5T6PoeWhAV-mBSVZXDvqABCcS9ksdV8RZWjPL8BFvm0Zwgclv69a08gDY8w3ZmNqlhqgOBgGIyAEKxDGMsVpWoZV1W1dxFpmRFchFM1IoaC46WjScdjrnom1BmSZiaAu9ZXY2N13Q9T0aTQM3vYty2reZ+xtc1Jh5kqWLNDJmiQ4o0Okp6ijw3Ynm3fdj1WM9mkdl2QWcbe6Q8eFmayCcFamN+b56BJlYel6Pp+voAbVltTOo6z7OQO2nZTLqCT0AORomma30Tvj-LKNFbheGYehYiDajS+0sv6DcWKOZ0yss+jkbqxp3Oobzaa-YLRQYsqbXKW+jqLh6pQuBWrrVk41uI4MyPM2jbMY62PvazEutXnGibJnjf0FDcLReI6Xx1J0dRSYgZax5WdRqL1jhte76feb5RUXgOIXF4LTTqOUZtOOlttKB6rUAdmujy8N1t+CGYj4HAkiAgHAsNc0xKevmFJFpKVGqMNdh9E8qVaONGCb-V-GyE7scKmcVzATc65mOiNZlmUeaJTo181YQFvmtfYtRy4nBfpcN+dcHh2EBtuDabUFzfhVEjQ8EZQTq05sA+8gcGqeFju4GSJ1qjw2pvIdc9hv4iWaNmT8l0U4YMgppDSICTYFDrCUGSJDfiXDUO6X8TQ+rtA+J0XEJhcroIgkAsIsF4JtnYSXWQBhigGGaM6G4LglQuBIvaMiZIvCZQuFfaR6kvZZxYvcfmd8LIqPKC1FciUlAbTfMqdcslZQqGVEYro8hAGZy0jpWAekDKYWNsolQxI25Ox6F1KiLoHJPBeDcd4mUfjBiYTIwJbZBAhNQKxJRgsaLRXBsNGivoQKCOkrUYoSlOgK1MAYQBk0ApFKnLiF4ZRTiVC0SDJ4654FHG3PTBWwMAFmK8q0sAGsuztP4jJVQi5KxCj6N0PMVDNzf26XuJQLTu4zLYXgreCylAvDsGUES7gAzfgOtJYRAEOgCJ0IlFuTp9mFRmdpCAul9KdnmetQSO4ekL1xOlJJTlUnUyaN+dwjDQzI3ygcuRcEEIAvyDJFoJhcTpLONTD4ejd6kgEW4T8AZ-GTKRZ8piBTrE-ROeteQ3oQbpSIh0bM9NKG-k8fJc4uJEreA7qzdFchfhP0dIlWoNFtBvnXLaEoFwYW9McAIoVT1BAQDICK0uXQKzUVdKTIUyhpabm+GcARjoKgLjVRnCx2qVE4ULC6NwuINpMulsYF4vpVk0VPipLJeA06qxyZre1To7QiXIpobMZsfz3E9A7T4csFZBjQQGlGHtbVYKzpGMNHR1DUxeTXUOsCG5xyrDWJONrZG5PyYU45tiCZtB9B4Gi7g3AyTjfXJ0m0BFO08MBHoaaEVAiDU9aZ2rdCqAqHPBO3rYket3vOsw1QnD+pHcEMdbNpmzNwTY0B9dTCtCaOUUwPamVcvjTLJNhrAxK0mVuru1Kjn7o4c41osUzXHFKAuksZam6jL6G3YMfggA */
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
