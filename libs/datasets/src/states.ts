import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import {
  screenSpaceSelectionAtom,
  type ScreenSpaceSelectionEntry
} from '@takram/plateau-screen-space-selection'

import { PLATEAU_TILE_FEATURE } from './PlateauTileset'

export const showTilesetTextureAtom = atomWithReset(true)
export const showTilesetWireframeAtom = atomWithReset(false)
export const showTilesetBoundingVolumeAtom = atomWithReset(false)

export const featureSelectionAtom = atom(get => {
  return get(screenSpaceSelectionAtom).filter(
    (entry): entry is ScreenSpaceSelectionEntry<typeof PLATEAU_TILE_FEATURE> =>
      entry.type === PLATEAU_TILE_FEATURE
  )
})
