import { type WritableAtom } from 'jotai'
import { atomWithStorage, type RESET } from 'jotai/utils'

type SetStateActionWithReset<T> =
  | T
  | typeof RESET
  | ((prevValue: T) => T | typeof RESET)

export interface AtomWithStorageValidationParams<T, Options = never> {
  key: string
  initialValue: T
  validate: (value: unknown, options?: Options) => value is T
  validateOptions?: Options
}

export function atomWithStorageValidation<T, Options = never>({
  key,
  initialValue,
  validate,
  validateOptions
}: AtomWithStorageValidationParams<T, Options>): WritableAtom<
  T,
  [SetStateActionWithReset<T>],
  void
> {
  return atomWithStorage(key, initialValue, {
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
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem: key => {
      localStorage.removeItem(key)
    }
  })
}
