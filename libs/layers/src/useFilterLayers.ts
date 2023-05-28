import { useSetAtom, type Getter } from 'jotai'

import { filterLayersAtom } from './states'
import {
  type LayerModel,
  type LayerModelOverrides,
  type LayerType
} from './types'

// Provided for generic setter.
export function useFilterLayers(): <T extends LayerType>(
  layers: readonly LayerModel[],
  predicate:
    | ({ type: T } & Partial<Omit<LayerModelOverrides[T], 'type'>>)
    | Partial<LayerModel>
    | ((layer: LayerModelOverrides[T], get: Getter) => boolean)
) => Array<LayerModelOverrides[T]> {
  return useSetAtom(filterLayersAtom)
}
