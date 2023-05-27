import { atomWithReset } from 'jotai/utils'
import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  return {
    showTexturesAtom: atomWithReset(true),
    showWireframeAtom: atomWithReset(false),
    showBoundingVolumeAtom: atomWithReset(false)
  }
}

export type PlateauDatasetsContextValue = ReturnType<typeof createContextValue>

export const PlateauDatasetsContext = createContext(createContextValue())
