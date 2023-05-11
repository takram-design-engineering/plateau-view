import { useEffect, useRef } from 'react'

// Define frequently-used types only because we can't infer EventMap from
// element type.
// https://github.com/microsoft/TypeScript/issues/40689

type EventListenerOptions = boolean | Omit<AddEventListenerOptions, 'once'>

export function useElementEvent<T extends Event>(
  element: Element | null | undefined,
  eventName: string,
  callback: (event: T) => void,
  options?: EventListenerOptions
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const optionsRef = useRef(options)
  useEffect(() => {
    if (element == null) {
      return
    }
    const listener = (event: Event): void => {
      callbackRef.current?.(event as T)
    }
    const options = optionsRef.current
    element.addEventListener(eventName, listener, options)
    return () => {
      element.removeEventListener(eventName, listener, options)
    }
  }, [element, eventName])
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (event: WindowEventMap[K]) => void,
  options?: EventListenerOptions
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const optionsRef = useRef(options)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const listener = (event: WindowEventMap[K]): void => {
      callbackRef.current?.(event)
    }
    const options = optionsRef.current
    window.addEventListener(eventName, listener, options)
    return () => {
      window.removeEventListener(eventName, listener, options)
    }
  }, [eventName])
}

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  eventName: K,
  callback: (event: DocumentEventMap[K]) => void,
  options?: EventListenerOptions
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const optionsRef = useRef(options)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const listener = (event: DocumentEventMap[K]): void => {
      callbackRef.current?.(event)
    }
    const options = optionsRef.current
    document.addEventListener(eventName, listener, options)
    return () => {
      document.removeEventListener(eventName, listener, options)
    }
  }, [eventName])
}
