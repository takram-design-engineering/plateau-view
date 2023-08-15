import { type Primitive } from '@cesium/engine'
import { useEffect, useState } from 'react'

import { useCesium } from './useCesium'

export function usePrimitiveReady(target: Primitive): boolean {
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
