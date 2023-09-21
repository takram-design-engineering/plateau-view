import { useAtom } from 'jotai'
import { type FC } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

import { layerSelectionAtom } from '@takram/plateau-layers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'
import { colorSchemeSelectionAtom } from '@takram/plateau-view-layers'

function clearValue<T>(prevValue: readonly T[]): readonly T[] {
  return prevValue.length !== 0 ? [] : prevValue
}

export const SelectionCoordinator: FC = () => {
  const [layerSelection, setLayerSelection] = useAtom(layerSelectionAtom)
  const [screenSpaceSelection, setScreenSpaceSelection] = useAtom(
    screenSpaceSelectionAtom
  )
  const [colorSchemeSelection, setColorSchemeSelection] = useAtom(
    colorSchemeSelectionAtom
  )

  useIsomorphicLayoutEffect(() => {
    if (screenSpaceSelection.length > 0) {
      setLayerSelection(clearValue)
      setColorSchemeSelection(clearValue)
    }
  }, [screenSpaceSelection, setLayerSelection, setColorSchemeSelection])

  useIsomorphicLayoutEffect(() => {
    if (layerSelection.length > 0) {
      setScreenSpaceSelection(clearValue)
      setColorSchemeSelection(clearValue)
    }
  }, [layerSelection, setScreenSpaceSelection, setColorSchemeSelection])

  useIsomorphicLayoutEffect(() => {
    if (colorSchemeSelection.length > 0) {
      setLayerSelection(clearValue)
      setScreenSpaceSelection(clearValue)
    }
  }, [colorSchemeSelection, setLayerSelection, setScreenSpaceSelection])

  return null
}
