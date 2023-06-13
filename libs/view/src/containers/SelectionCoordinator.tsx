import { useAtom, useAtomValue } from 'jotai'
import { type FC } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

import { useCesium } from '@takram/plateau-cesium'
import { layerSelectionAtom } from '@takram/plateau-layers'
import { PEDESTRIAN_OBJECT } from '@takram/plateau-pedestrian'
import { useElementEvent } from '@takram/plateau-react-helpers'
import { screenSpaceSelectionAtom } from '@takram/plateau-screen-space-selection'

import { toolAtom } from '../states/tool'

function clearValue<T>(prevValue: readonly T[]): readonly T[] {
  return prevValue.length !== 0 ? [] : prevValue
}

export const SelectionCoordinator: FC = () => {
  const [layerSelection, setLayerSelection] = useAtom(layerSelectionAtom)
  const [screenSpaceSelection, setScreenSpaceSelection] = useAtom(
    screenSpaceSelectionAtom
  )

  useIsomorphicLayoutEffect(() => {
    if (screenSpaceSelection.length === 1) {
      const [selection] = screenSpaceSelection
      if (selection.type === PEDESTRIAN_OBJECT) {
        const layerId = selection.value.split(':')[1]
        setScreenSpaceSelection(clearValue)
        setLayerSelection([layerId])
        return
      }
    }
    if (screenSpaceSelection.length > 0) {
      setLayerSelection(clearValue)
    }
  }, [setLayerSelection, screenSpaceSelection, setScreenSpaceSelection])

  useIsomorphicLayoutEffect(() => {
    if (layerSelection.length > 0) {
      setScreenSpaceSelection(clearValue)
    }
  }, [layerSelection, setLayerSelection, setScreenSpaceSelection])

  // TODO: Bit of workaround.
  // TODO: Deal with touch events.
  const canvas = useCesium(({ canvas }) => canvas)
  const tool = useAtomValue(toolAtom)
  useElementEvent(canvas, 'pointerdown', (event: MouseEvent) => {
    if (
      tool === 'select' &&
      event.button === 0 &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      setLayerSelection(clearValue)
    }
  })

  return null
}
