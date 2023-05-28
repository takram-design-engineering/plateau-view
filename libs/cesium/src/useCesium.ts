import { useAtomValue } from 'jotai'

import { type CesiumRoot } from './CesiumRoot'
import { cesiumAtom } from './states'

type Selector<T> = (cesium: CesiumRoot) => T

export interface UseCesiumOptions<Indirect extends boolean = false> {
  indirect?: Indirect
}

export function useCesium<Indirect extends boolean = false>(
  options?: UseCesiumOptions<Indirect>
): Indirect extends true ? CesiumRoot | undefined : CesiumRoot

export function useCesium<T = CesiumRoot, Indirect extends boolean = false>(
  selector?: Selector<T>,
  options?: UseCesiumOptions<Indirect>
): Indirect extends true ? T | undefined : T

export function useCesium<T, Indirect extends boolean = false>(
  arg1?: Selector<T> | UseCesiumOptions<Indirect>,
  arg2?: UseCesiumOptions<Indirect>
): CesiumRoot | T | undefined {
  let selector
  let options
  if (typeof arg1 === 'function') {
    selector = arg1
    options = arg2
  } else {
    options = arg1
  }
  const cesium = useAtomValue(cesiumAtom)
  if (cesium == null) {
    if (options?.indirect === true) {
      return undefined
    }
    throw new Error('useCesium must be used inside Canvas.')
  }
  return selector != null ? selector(cesium) : cesium
}
