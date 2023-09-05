import { useSetAtom } from 'jotai'

import { addLayerAtom, type AddLayerOptions } from './states'
import { type LayerModel, type LayerType } from './types'

// Provided for generic setter.
export function useAddLayer(): <T extends LayerType>(
  layer: Omit<LayerModel<T>, 'id'> & { type: T },
  options?: AddLayerOptions
) => () => void

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAddLayer() {
  return useSetAtom(addLayerAtom)
}
