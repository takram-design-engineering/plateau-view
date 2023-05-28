import { Event } from '@cesium/engine'
import { atom, type SetStateAction } from 'jotai'

import { type CesiumRoot } from './CesiumRoot'

export type DestroyCesiumCallback = (
  callback: (destructor: () => void) => void
) => void

export const destroyEvent = new Event<DestroyCesiumCallback>()

const cesiumPrimitiveAtom = atom<CesiumRoot | null>(null)
export const cesiumAtom = atom(
  get => get(cesiumPrimitiveAtom),
  (get, set, value: SetStateAction<CesiumRoot | null>) => {
    set(cesiumPrimitiveAtom, prevValue => {
      const destructors: Array<() => void> = []
      const callback = (destructor: () => void): void => {
        destructors.push(destructor)
      }
      destroyEvent.raiseEvent(callback)
      destructors.forEach(destructor => {
        destructor()
      })
      return typeof value === 'function' ? value(prevValue) : value
    })
  }
)

export const requestRenderAtom = atom(get => {
  const cesium = get(cesiumAtom)
  return () => {
    if (
      cesium != null &&
      !cesium.isDestroyed() &&
      !cesium.scene.isDestroyed()
    ) {
      cesium.scene.requestRender()
    }
  }
})
