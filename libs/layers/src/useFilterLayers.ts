import { useSetAtom } from 'jotai'

import { filterLayersAtom } from './states'
import { type LayerModel, type LayerPredicate, type LayerType } from './types'

// Provided for generic setter.
export function useFilterLayers(): <
  T extends LayerType,
  U extends LayerType = LayerType
>(
  layers: ReadonlyArray<LayerModel<T>>,
  predicate:
    | (Partial<LayerModel<U>> & { type: U })
    | Partial<LayerModel<U>>
    | LayerPredicate<T>
) => Array<LayerModel<T & U>>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useFilterLayers() {
  return useSetAtom(filterLayersAtom)
}
