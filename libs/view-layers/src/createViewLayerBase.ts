import { atom } from 'jotai'
import { type SetOptional } from 'type-fest'

import { type LayerModel } from '@takram/plateau-layers'

export interface ViewLayerBaseModelParams {
  municipalityCode: string
  title?: string
}

export function createViewLayerBase(
  params: ViewLayerBaseModelParams
): Omit<SetOptional<LayerModel, 'id'>, 'type'> {
  return {
    municipalityCode: params.municipalityCode,
    titleAtom: atom<string | null>(params.title ?? null),
    loadingAtom: atom(false),
    hiddenAtom: atom(false),
    selectedAtom: atom(false)
  }
}
