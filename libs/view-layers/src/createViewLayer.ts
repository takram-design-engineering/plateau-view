import { atom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { type LayerModel } from '@plateau/layers'

export interface ViewLayerModelParams {
  title?: string
}

export function createViewLayer(
  params: ViewLayerModelParams = {}
): Omit<SetOptional<LayerModel, 'id'>, 'type'> {
  return {
    titleAtom: atom<string | null>(params.title ?? null),
    loadingAtom: atom(false),
    hiddenAtom: atom(false),
    selectedAtom: atom(false)
  }
}
