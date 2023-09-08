import { useSetAtom } from 'jotai'
import { type FC } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

import { viewportHeightAtom, viewportWidthAtom } from '../states/app'

export const ViewportObserver: FC = () => {
  const setViewportWidth = useSetAtom(viewportWidthAtom)
  const setViewportHeight = useSetAtom(viewportHeightAtom)

  useIsomorphicLayoutEffect(() => {
    setViewportWidth(window.innerWidth)
    setViewportHeight(window.innerHeight)
    const observer = new ResizeObserver(() => {
      setViewportWidth(window.innerWidth)
      setViewportHeight(window.innerHeight)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
  }, [setViewportWidth, setViewportHeight])

  return null
}
