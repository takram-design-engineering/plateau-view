import { useAtomValue } from 'jotai'
import { useContext } from 'react'

import { useCesium } from '@takram/plateau-cesium'

import { SketchContext } from './SketchProvider'

export function useHandTool(): void {
  const { stateAtom } = useContext(SketchContext)
  const state = useAtomValue(stateAtom)

  const scene = useCesium(({ scene }) => scene)
  const canvas = useCesium(({ canvas }) => canvas)

  if (
    state.matches('activeTool.modal.hand') ||
    state.matches('activeTool.momentary.hand')
  ) {
    canvas.style.cursor = 'grabbing'
  } else if (
    state.matches('selectedTool.modal.hand') ||
    state.matches('selectedTool.momentary.hand')
  ) {
    canvas.style.cursor = 'grab'
    scene.screenSpaceCameraController.enableRotate = true
  } else {
    canvas.style.cursor = 'auto'
    scene.screenSpaceCameraController.enableRotate = false
  }
}
