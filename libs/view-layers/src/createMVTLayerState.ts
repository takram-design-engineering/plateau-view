import { atom, type PrimitiveAtom } from 'jotai'

export interface MVTLayerStateParams {
  opacity?: number
}

export interface MVTLayerState {
  opacityAtom: PrimitiveAtom<number>
}

export function createMVTLayerState(
  params: MVTLayerStateParams
): MVTLayerState {
  return {
    opacityAtom: atom(params.opacity ?? 1)
  }
}
