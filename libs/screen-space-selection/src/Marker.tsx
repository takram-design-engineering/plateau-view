import { alpha, styled } from '@mui/material'
import { useAtomValue } from 'jotai'
import { useContext, useEffect, useRef, type FC } from 'react'

import { ScreenSpaceSelectionContext } from './ScreenSpaceSelectionContext'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'colorMode'
})<{
  colorMode: 'light' | 'dark'
}>(({ theme, colorMode }) => {
  const color = theme.palette.grey[colorMode === 'light' ? 600 : 400]
  return {
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: alpha(color, 0.9),
    backgroundColor: alpha(color, 0.25),
    pointerEvents: 'none'
  }
})

export const Marker: FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  const { colorModeAtom, handlerAtom } = useContext(ScreenSpaceSelectionContext)
  const handler = useAtomValue(handlerAtom)

  useEffect(() => {
    if (handler == null) {
      return
    }
    const removeListeners = [
      handler.indeterminate.addEventListener(event => {
        if (ref.current == null) {
          return
        }
        if (event.type === 'rectangle') {
          const { x, y, width, height } = event.rectangle
          ref.current.style.display = 'block'
          ref.current.style.top = `${y}px`
          ref.current.style.left = `${x}px`
          ref.current.style.width = `${width}px`
          ref.current.style.height = `${height}px`
        } else {
          ref.current.style.display = 'none'
        }
      }),
      handler.change.addEventListener(event => {
        if (ref.current == null) {
          return
        }
        ref.current.style.display = 'none'
      })
    ]
    return () => {
      removeListeners.forEach(removeListener => {
        removeListener()
      })
    }
  }, [handler])

  const colorMode = useAtomValue(colorModeAtom)
  return <Root ref={ref} colorMode={colorMode} />
}
