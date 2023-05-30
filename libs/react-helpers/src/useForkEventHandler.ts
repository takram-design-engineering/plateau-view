import { useCallback, useRef } from 'react'

export function useForkEventHandler<Args extends unknown[]>(
  ...handlers: ReadonlyArray<((...args: Args) => void) | undefined>
): (...args: Args) => void {
  const ref = useRef(handlers)
  ref.current = handlers
  return useCallback((...args) => {
    // Invoke handlers in the reverse order.
    for (let i = ref.current.length - 1; i >= 0; --i) {
      ref.current[i]?.(...args)
    }
  }, [])
}
