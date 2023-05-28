import { type ForwardedRef } from 'react'

export function assignForwardedRef<T>(
  forwardedRef: ForwardedRef<T> | undefined,
  value: T | null
): (() => void) | undefined {
  if (typeof forwardedRef === 'function') {
    forwardedRef(value)
    return () => {
      forwardedRef(null)
    }
  } else if (forwardedRef != null) {
    forwardedRef.current = value
    return () => {
      forwardedRef.current = null
    }
  }
}
