import { atom } from 'jotai'

import { readyAtom as readyPrimitiveAtom } from './states/app'

export * from './PlateauView'

export const readyAtom = atom(get => get(readyPrimitiveAtom))
