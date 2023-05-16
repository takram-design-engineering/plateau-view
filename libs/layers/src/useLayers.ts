import { useContext } from 'react'

import { LayersContext, type LayersContextValue } from './LayersContext'

export function useLayers(): LayersContextValue {
  const context = useContext(LayersContext)
  if (context == null) {
    throw new Error('useLayers must be used inside LayersProvider.')
  }
  return context
}
