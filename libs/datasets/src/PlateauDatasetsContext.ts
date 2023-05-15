import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'
import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  return {
    colorModeAtom: atom<'light' | 'dark'>('light'),
    showTexturesAtom: atomWithReset(true),
    showWireframeAtom: atomWithReset(false),
    showBoundingVolumeAtom: atomWithReset(false)
  }
}

export const PlateauDatasetsContext = createContext(createContextValue())
