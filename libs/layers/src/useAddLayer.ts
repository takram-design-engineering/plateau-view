import { useSetAtom } from 'jotai'
import { useContext } from 'react'

import { LayersContext, type LayersContextValue } from './LayersContext'
import { type LayerModelOverrides, type LayerType } from './types'

export function useAddLayer(): <T extends LayerType>(
  layer: {
    type: T
    id?: string
  } & Omit<LayerModelOverrides[T], 'type' | 'id'>
) => ReturnType<LayersContextValue['addAtom']['write']> {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useAddLayer must be used inside LayersProvider.')
  }
  const { addAtom } = context
  return useSetAtom(addAtom)
}
