import { useCallback } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { animateZoom } from '@takram/plateau-cesium-helpers'

let promise = Promise.resolve()

export interface CameraZoom {
  zoomIn: () => void
  zoomOut: () => void
}

export function useCameraZoom(): CameraZoom {
  const scene = useCesium(({ scene }) => scene, { indirect: true })

  const zoomOut = useCallback(() => {
    if (scene == null) {
      return
    }
    promise = promise.then(async () => {
      await animateZoom(scene, -1)
    })
  }, [scene])

  const zoomIn = useCallback(() => {
    if (scene == null) {
      return
    }
    promise = promise.then(async () => {
      await animateZoom(scene, 1 / 2)
    })
  }, [scene])

  return { zoomIn, zoomOut }
}
