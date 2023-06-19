import {
  Math as CesiumMath,
  PerspectiveFrustum,
  type Globe,
  type Scene
} from '@cesium/engine'
import { atom, useAtomValue } from 'jotai'
import { memo, type FC } from 'react'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { layersAtom } from '@takram/plateau-layers'
import { RIVER_FLOODING_RISK_LAYER } from '@takram/plateau-view-layers'

import { antialiasTypeAtom } from '../states/graphics'
import { showGlobeWireframeAtom } from '../states/performance'

const shouldDisableDepthTestAtom = atom(get =>
  get(layersAtom).some(
    ({ type, hiddenAtom }) =>
      type === RIVER_FLOODING_RISK_LAYER && !get(hiddenAtom)
  )
)

export const SceneCoordinator: FC = memo(() => {
  const scene = useCesium(({ scene }) => scene)

  // Increase the precision of the depth buffer which HBAO looks up to
  // reconstruct normals.
  usePreRender(() => {
    const { globeHeight } = scene as Scene & { globeHeight?: number }
    if (globeHeight == null) {
      return
    }
    // Screen-space camera controller should detect collision
    const cameraHeight = scene.camera.positionCartographic.height - globeHeight
    const frustum = scene.camera.frustum
    if (frustum instanceof PerspectiveFrustum) {
      scene.camera.frustum.near =
        CesiumMath.clamp(cameraHeight - 1, 1, 5) / Math.tan(frustum.fov / 2)
    }
  })

  const showGlobeWireframe = useAtomValue(showGlobeWireframeAtom)
  const globe = scene.globe as Globe & {
    _surface: {
      tileProvider: {
        _debug: {
          wireframe: boolean
        }
      }
    }
  }
  globe._surface.tileProvider._debug.wireframe = showGlobeWireframe

  const antialiasType = useAtomValue(antialiasTypeAtom)
  scene.postProcessStages.fxaa.enabled = antialiasType === 'fxaa'

  // It's not possible to selectively turn off depth test of 3D tileset.
  // TODO: Define bounding sphere for every layer, test it against the current
  // frustum, and disable depth test only when active layers are within it.
  scene.globe.depthTestAgainstTerrain = !useAtomValue(
    shouldDisableDepthTestAtom
  )

  scene.requestRender()
  return null
})
