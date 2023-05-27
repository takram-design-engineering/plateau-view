import { atom, useAtomValue } from 'jotai'
import { memo, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { layersAtom } from '@takram/plateau-layers'
import { FLOOD_LAYER } from '@takram/plateau-view-layers'

const shouldDisableDepthTestAtom = atom(get =>
  get(layersAtom).some(
    ({ type, hiddenAtom }) => type === FLOOD_LAYER && !get(hiddenAtom)
  )
)

// It's not possible to selectively turn off depth test of 3D tileset.
// TODO: Define bounding sphere for every layer, test it against the current
// frustum, and disable depth test only when active layers are within it.
export const GlobeDepthTestCoordinator: FC = memo(() => {
  const scene = useCesium(({ scene }) => scene)
  scene.globe.depthTestAgainstTerrain = !useAtomValue(
    shouldDisableDepthTestAtom
  )
  scene.requestRender()
  return null
})
