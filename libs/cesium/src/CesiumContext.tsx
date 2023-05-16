import { Event } from '@cesium/engine'
import { atom, type SetStateAction } from 'jotai'
import { createContext } from 'react'

import { type CesiumRoot } from './CesiumRoot'

export type DestroyCesiumCallback = (
  callback: (destructor: () => void) => void
) => void

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContextValue() {
  const cesiumPrimitiveAtom = atom<CesiumRoot | null>(null)
  const destroyEvent = new Event<DestroyCesiumCallback>()

  const cesiumAtom = atom(
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

  return {
    cesiumAtom,
    destroyEvent
  }
}

export type CesiumContextValue = ReturnType<typeof createContextValue>

export const CesiumContext = createContext(createContextValue())
