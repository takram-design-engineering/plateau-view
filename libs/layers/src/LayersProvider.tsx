import { useMemo, type FC, type ReactNode } from 'react'

import { LayersContext, createContextValue } from './LayersContext'

export interface LayersProviderProps {
  children?: ReactNode
}

export const LayersProvider: FC<LayersProviderProps> = ({
  children,
  ...props
}) => {
  const context = useMemo(() => createContextValue(), [])
  return (
    <LayersContext.Provider value={context}>{children}</LayersContext.Provider>
  )
}
