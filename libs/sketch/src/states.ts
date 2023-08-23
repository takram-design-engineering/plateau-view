import { atomWithMachine } from 'jotai-xstate'

import { createSketchMachine } from './sketchMachine'

export const sketchMachineAtom = atomWithMachine(get => createSketchMachine())
