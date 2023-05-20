import { atom } from 'jotai'
import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  return {
    pixelRatioAtom: atom(2)
  }
}

export type ViewLayersContextValue = ReturnType<typeof createContextValue>

export const ViewLayersContext = createContext(createContextValue())
