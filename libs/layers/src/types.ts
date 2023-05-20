import { type ComponentType } from 'react'

export interface LayerModel {
  id: string
  type: LayerType
}

// Must be an interface to be override.
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface LayerModelOverrides {
  [type: string]: LayerModel
}

export type LayerType = keyof LayerModelOverrides

export type LayerProps<T extends LayerType = LayerType> = {
  [K in keyof LayerModelOverrides[T]]: LayerModelOverrides[T][K]
} & {
  index: number
}

export type LayerComponents = {
  [T in keyof LayerModelOverrides]: ComponentType<LayerProps<T>>
}
