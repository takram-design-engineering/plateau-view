import { atom } from 'jotai'

import { readyAtom as readyPrimitiveAtom } from './states/app'

export * from './imageryLayers/VectorMapImageryLayer'
export * from './PlateauView'
export { platformAtom } from './states/app'

export const readyAtom = atom(get => get(readyPrimitiveAtom))
