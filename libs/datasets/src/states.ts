import { atomWithReset } from 'jotai/utils'

export const showTilesetTextureAtom = atomWithReset(true)
export const showTilesetWireframeAtom = atomWithReset(false)
export const showTilesetBoundingVolumeAtom = atomWithReset(false)
