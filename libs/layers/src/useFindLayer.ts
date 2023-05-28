import { useSetAtom } from 'jotai'

import { findLayerAtom } from './states'
import { type LayerModel, type LayerPredicate, type LayerType } from './types'

// Provided for generic setter.
export function useFindLayer(): <
  T extends LayerType,
  U extends LayerType = LayerType
>(
  layers: ReadonlyArray<LayerModel<T>>,
  predicate:
    | (LayerModel<T> & { type: U })
    | Partial<LayerModel<U>>
    | LayerPredicate<T>
) => LayerModel<T & U> | undefined

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useFindLayer() {
  return useSetAtom(findLayerAtom)
}
