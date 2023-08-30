import { atom, type Atom } from 'jotai'
import { splitAtom } from 'jotai/utils'

export function isNotNullish<T>(value: T | null | undefined): value is T {
  return value != null
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isNotFalse<T>(value: T | false): value is T {
  return value !== false
}

export type CancelablePromise<T> = Promise<T> & {
  cancel: () => void
}

export function assertType<T>(value: unknown): asserts value is T {}

export type AtomValue<T> = T extends Atom<infer Value> ? Value : never

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const splitAtomType = <T>() => splitAtom(atom<T[]>([]))
export type SplitAtom<T> = ReturnType<typeof splitAtomType<T>>
