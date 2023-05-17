import { type PrimitiveAtom } from 'jotai'
import { type ComponentType, type ReactNode } from 'react'

export interface LayerModel {
  type: LayerType
  id: string
  title: ReactNode
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface LayerModelOverrides {
  [type: string]: LayerModel
}

export type LayerType = keyof LayerModelOverrides

export type AnyLayerModel = LayerModelOverrides[LayerType]

export interface LayerProps<T extends LayerType = LayerType> {
  layerAtom: PrimitiveAtom<LayerModelOverrides[T]>
}

export type LayerComponents = {
  [T in LayerType]: ComponentType<LayerProps<any>> // TODO: Refine type
}
