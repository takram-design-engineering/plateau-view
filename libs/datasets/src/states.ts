import { atomWithReset } from 'jotai/utils'

export const showTexturesAtom = atomWithReset(true)
export const showWireframeAtom = atomWithReset(false)
export const showBoundingVolumeAtom = atomWithReset(false)
