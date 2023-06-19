import { Cartesian2, Cartesian3, SceneTransforms } from '@cesium/engine'
import { styled } from '@mui/material'
import { forwardRef, useRef, type ComponentPropsWithRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

const Root = styled('div')({
  position: 'absolute'
})

export interface ScreenSpaceElementProps
  extends ComponentPropsWithRef<typeof Root> {
  position?: Cartesian3
}

const windowPositionScratch = new Cartesian2()

export const ScreenSpaceElement = forwardRef<
  HTMLDivElement,
  ScreenSpaceElementProps
>(({ position: positionProp, ...props }, forwardedRef) => {
  const position = useConstant(() => new Cartesian3())
  positionProp?.clone(position)

  const ref = useRef<HTMLDivElement>(null)
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  usePreRender(() => {
    if (ref.current == null || scene == null) {
      return
    }
    const windowPosition = SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      position,
      windowPositionScratch
    )
    const x = `calc(${windowPosition.x}px - 50%)`
    const y = `calc(${windowPosition.y}px - 50%)`
    ref.current.style.transform = `translate(${x}, ${y})`
  })

  return <Root ref={mergeRefs([ref, forwardedRef])} {...props} />
})
