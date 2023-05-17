import { useSetAtom, type Getter } from 'jotai'
import { useContext } from 'react'

import { LayersContext } from './LayersContext'
import { type LayerModelOverrides, type LayerType } from './types'

export function useFindLayer(): <T extends LayerType>(
  layer:
    | Partial<{ type: T } & Omit<LayerModelOverrides[T], 'type'>>
    | ((layer: LayerModelOverrides[T], get: Getter) => boolean)
) => LayerModelOverrides[T] | undefined {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useAddLayer must be used inside LayersProvider.')
  }
  const { findAtom } = context
  return useSetAtom(findAtom)
}