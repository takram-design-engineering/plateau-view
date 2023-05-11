import { type ForwardedRef } from 'react'

export function assignForwardedRef<T>(
  forwardedRef: ForwardedRef<T> | undefined,
  value: T | null
): void {
  if (typeof forwardedRef === 'function') {
    forwardedRef(value)
  } else if (forwardedRef != null) {
    forwardedRef.current = value
  }
}
