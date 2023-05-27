import { useSetAtom } from 'jotai'

import { addLayerAtom } from './states'
import { type LayerModelOverrides, type LayerType } from './types'

// Provided for generic setter.
export function useAddLayer(): <T extends LayerType>(
  layer: {
    type: T
    id?: string
  } & Omit<LayerModelOverrides[T], 'type' | 'id'>
) => ReturnType<(typeof addLayerAtom)['write']> {
  return useSetAtom(addLayerAtom)
}
