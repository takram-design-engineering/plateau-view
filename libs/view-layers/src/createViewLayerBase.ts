import { atom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { type LayerModel } from '@takram/plateau-layers'

import { type LayerTitle } from './types'

export interface ViewLayerModelParams {
  title?: string
}

export interface ViewLayerModel extends LayerModel {}

export function createViewLayerBase(
  params: ViewLayerModelParams
): Omit<SetOptional<ViewLayerModel, 'id'>, 'type'> {
  return {
    titleAtom: atom<LayerTitle | null>(params.title ?? null),
    loadingAtom: atom(false),
    hiddenAtom: atom(false)
  }
}
