import { useAtom } from 'jotai'
import { useEffect, type FC } from 'react'

import { layerSelectionAtom } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

export const ExclusiveSelection: FC = () => {
  const [layerSelection, setLayerSelection] = useAtom(layerSelectionAtom)
  const [screenSpaceSelection, setScreenSpaceSelection] = useAtom(
    screenSpaceSelectionAtom
  )

  useEffect(() => {
    if (layerSelection.length > 0) {
      setScreenSpaceSelection([])
    }
  }, [layerSelection, setLayerSelection, setScreenSpaceSelection])

  useEffect(() => {
    if (screenSpaceSelection.length > 0) {
      setLayerSelection([])
    }
  }, [setLayerSelection, screenSpaceSelection, setScreenSpaceSelection])

  return null
}
