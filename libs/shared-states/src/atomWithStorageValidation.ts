import { type WritableAtom } from 'jotai'
import { atomWithStorage, type RESET } from 'jotai/utils'

type SetStateActionWithReset<T> =
  | T
  | typeof RESET
  | ((prev: T) => T | typeof RESET)

export const STORAGE_KEY = Symbol('STORAGE_KEY')

export interface AtomWithStorageValidationParams<
  T,
  Options = never,
  K extends string = string
> {
  key: K
  initialValue: T
  validate: (value: unknown, options?: Options) => value is T
  validateOptions?: Options
}

export function atomWithStorageValidation<T, Options, K extends string>({
  key,
  initialValue,
  validate,
  validateOptions
}: AtomWithStorageValidationParams<T, Options, K>): WritableAtom<
  T,
  [SetStateActionWithReset<T>],
  void
> & { [STORAGE_KEY]: K } {
  return Object.assign(
    atomWithStorage(key, initialValue, {
      getItem: (key, initialValue) => {
        const storedValue = localStorage.getItem(key)
        if (storedValue == null) {
          return initialValue
        }
        try {
          const parsedValue = JSON.parse(storedValue)
          if (!validate(parsedValue, validateOptions)) {
            return initialValue
          }
          return parsedValue
        } catch {
          return initialValue
        }
      },
      setItem: async (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
      },
      removeItem: async key => {
        localStorage.removeItem(key)
      }
    }),
    { [STORAGE_KEY]: key }
  )
}
