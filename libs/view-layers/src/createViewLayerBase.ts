import { atom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { type LayerModelBase } from '@takram/plateau-layers'

import { type LayerTitle } from './types'

export interface ViewLayerModelParams {
  title?: string
}

export interface ViewLayerModel extends LayerModelBase {}

export function createViewLayerBase(
  params: ViewLayerModelParams
): Omit<SetOptional<ViewLayerModel, 'id'>, 'type'> {
  return {
    titleAtom: atom<LayerTitle | null>(params.title ?? null),
    loadingAtom: atom(false),
    hiddenAtom: atom(false)
  }
}
