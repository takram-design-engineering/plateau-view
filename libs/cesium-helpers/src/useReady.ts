import { useEffect, useState } from 'react'

import { useCesium } from '@takram/plateau-cesium'

export function useReady<T extends { ready: boolean }>(target: T): boolean {
  const scene = useCesium(({ scene }) => scene)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const removeListener = scene.postUpdate.addEventListener(() => {
      if (target.ready) {
        setReady(true)
        removeListener()
      }
    })
    return () => {
      removeListener()
    }
  }, [target, scene])
  return ready
}
