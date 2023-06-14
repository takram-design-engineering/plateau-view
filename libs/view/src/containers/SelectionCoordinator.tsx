import { useAtom } from 'jotai'
import { type FC } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

import { layerSelectionAtom } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

function clearValue<T>(prevValue: readonly T[]): readonly T[] {
  return prevValue.length !== 0 ? [] : prevValue
}

export const SelectionCoordinator: FC = () => {
  const [layerSelection, setLayerSelection] = useAtom(layerSelectionAtom)
  const [screenSpaceSelection, setScreenSpaceSelection] = useAtom(
    screenSpaceSelectionAtom
  )

  useIsomorphicLayoutEffect(() => {
    if (screenSpaceSelection.length > 0) {
      setLayerSelection(clearValue)
    }
  }, [setLayerSelection, screenSpaceSelection, setScreenSpaceSelection])

  useIsomorphicLayoutEffect(() => {
    if (layerSelection.length > 0) {
      setScreenSpaceSelection(clearValue)
    }
  }, [layerSelection, setLayerSelection, setScreenSpaceSelection])

  return null
}
