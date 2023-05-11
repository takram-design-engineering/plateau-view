import { ScreenSpaceEventHandler } from '@cesium/engine'

import { useCesium } from './useCesium'
import { useInstance } from './useInstance'

export function useScreenSpaceEventHandler(): ScreenSpaceEventHandler {
  const canvas = useCesium(({ canvas }) => canvas)
  return useInstance({
    keys: [canvas],
    create: () => new ScreenSpaceEventHandler(canvas)
  })
}
