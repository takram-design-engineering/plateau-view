import { createContext } from 'react'

import { atomsWithSelection } from './atomsWithSelection'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  return atomsWithSelection()
}

export type ScreenSpaceSelectionContextValue = ReturnType<
  typeof createContextValue
>

export const ScreenSpaceSelectionContext = createContext(createContextValue())
