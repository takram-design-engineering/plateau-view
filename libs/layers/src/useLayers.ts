import { omit } from 'lodash'
import { useContext } from 'react'

import { LayersContext, type LayersContextValue } from './LayersContext'

export function useLayers(): Omit<
  LayersContextValue,
  // Omit atoms with generic setters.
  'addAtom' | 'findAtom' | 'filterAtom'
> {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useLayers must be used inside LayersProvider.')
  }
  return omit(context, ['addAtom', 'findAtom', 'filterAtom'])
}
