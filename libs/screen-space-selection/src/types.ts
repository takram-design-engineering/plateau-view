import { type BoundingSphere } from '@cesium/engine'
import { type Primitive } from 'type-fest'

export interface ScreenSpaceSelectionOverrides {}

export type ScreenSpaceSelectionType = keyof ScreenSpaceSelectionOverrides

export type ScreenSpaceSelectionKey = Exclude<Primitive, null | undefined>

export type ScreenSpaceSelectionEntry<
  T extends ScreenSpaceSelectionType = ScreenSpaceSelectionType
> = {
  [K in ScreenSpaceSelectionType]: K extends T
    ? ScreenSpaceSelectionOverrides[K] extends ScreenSpaceSelectionKey
      ? {
          type: K
          value: ScreenSpaceSelectionOverrides[K]
        }
      : ScreenSpaceSelectionOverrides[K] extends {
          key: ScreenSpaceSelectionKey
        }
      ? {
          type: K
          value: ScreenSpaceSelectionOverrides[K]
        }
      : never
    : never
}[ScreenSpaceSelectionType]

export type ComputeBoundingSphere<
  T extends ScreenSpaceSelectionType = ScreenSpaceSelectionType
> = (
  value: ScreenSpaceSelectionEntry<T>,
  result?: BoundingSphere
) => BoundingSphere | undefined

export interface ScreenSpaceSelectionResponder<
  T extends ScreenSpaceSelectionType = ScreenSpaceSelectionType,
  U extends object = object
> {
  transform: (object: U) => ScreenSpaceSelectionEntry<T> | null | undefined
  predicate: (
    value: ScreenSpaceSelectionEntry
  ) => value is ScreenSpaceSelectionEntry<T>
  onSelect?: (value: ScreenSpaceSelectionEntry<T>) => void
  onDeselect?: (value: ScreenSpaceSelectionEntry<T>) => void
  computeBoundingSphere?: ComputeBoundingSphere<T>
}
