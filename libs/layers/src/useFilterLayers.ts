import { useSetAtom } from 'jotai'
import { useContext } from 'react'

import { LayersContext } from './LayersContext'
import { type LayerModelOverrides, type LayerType } from './types'

export function useFilterLayers(): <T extends LayerType>(
  layer: Partial<{ type: T } & Omit<LayerModelOverrides[T], 'type'>>
) => Array<LayerModelOverrides[T]> {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useAddLayer must be used inside LayersProvider.')
  }
  const { filterAtom } = context
  return useSetAtom(filterAtom)
}
