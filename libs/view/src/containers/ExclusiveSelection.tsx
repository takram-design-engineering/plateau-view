import { useAtom } from 'jotai'
import { useLayoutEffect, type FC } from 'react'

import { layerSelectionAtom } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

export const ExclusiveSelection: FC = () => {
  const [layerSelection, setLayerSelection] = useAtom(layerSelectionAtom)
  const [screenSpaceSelection, setScreenSpaceSelection] = useAtom(
    screenSpaceSelectionAtom
  )

  useLayoutEffect(() => {
    if (layerSelection.length > 0) {
      setScreenSpaceSelection([])
    }
  }, [layerSelection, setLayerSelection, setScreenSpaceSelection])

  useLayoutEffect(() => {
    if (screenSpaceSelection.length > 0) {
      setLayerSelection([])
    }
  }, [setLayerSelection, screenSpaceSelection, setScreenSpaceSelection])

  return null
}
