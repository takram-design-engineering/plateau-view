import { Event } from '@cesium/engine'
import { atom, type SetStateAction } from 'jotai'

import { type CesiumRoot } from './CesiumRoot'

export type DestroyCesiumCallback = (
  callback: (destructor: () => void) => void
) => void

const cesiumPrimitiveAtom = atom<CesiumRoot | null>(null)
const destroyEvent = new Event<DestroyCesiumCallback>()

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
