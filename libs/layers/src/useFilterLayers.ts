import { useSetAtom, type Getter } from 'jotai'
import { useContext } from 'react'

import { LayersContext } from './LayersContext'
import { type LayerModelOverrides, type LayerType } from './types'

export function useFilterLayers(): <T extends LayerType>(
  layerOrPredicate:
    | Partial<{ type: T } & Omit<LayerModelOverrides[T], 'type'>>
    | ((layer: LayerModelOverrides[T], get: Getter) => boolean)
) => Array<LayerModelOverrides[T]> {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useAddLayer must be used inside LayersProvider.')
  }
  const { filterAtom } = context
  return useSetAtom(filterAtom)
}
