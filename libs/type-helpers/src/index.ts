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
