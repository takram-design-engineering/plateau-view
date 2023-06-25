import {
  Cartesian2,
  Cartesian3,
  Ellipsoid,
  EllipsoidalOccluder,
  SceneTransforms
} from '@cesium/engine'
import { styled } from '@mui/material'
import { forwardRef, useRef, useState, type ComponentPropsWithRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { useCesium, usePreRender } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

const Root = styled('div')({
  position: 'absolute',
  pointerEvents: 'none'
})

export interface ScreenSpaceElementProps
  extends ComponentPropsWithRef<typeof Root> {
  position?: Cartesian3
}

const occluder = new EllipsoidalOccluder(Ellipsoid.WGS84, Cartesian3.ZERO)

const windowPositionScratch = new Cartesian2()

export const ScreenSpaceElement = forwardRef<
  HTMLDivElement,
  ScreenSpaceElementProps
>(({ position: positionProp, children, ...props }, forwardedRef) => {
  const position = useConstant(() => new Cartesian3())
  positionProp?.clone(position)

  const [visible, setVisible] = useState(false)

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
    occluder.cameraPosition = scene.camera.position
    if (
      windowPosition == null ||
      windowPosition.x < 0 ||
      windowPosition.y < 0 ||
      windowPosition.x > window.innerWidth ||
      windowPosition.y > window.innerHeight ||
      !occluder.isPointVisible(position)
    ) {
      setVisible(false)
      return
    }
    const x = `calc(${windowPosition.x}px - 50%)`
    const y = `calc(${windowPosition.y}px - 50%)`
    ref.current.style.transform = `translate(${x}, ${y})`
    setVisible(true)
  })

  return (
    <Root ref={mergeRefs([ref, forwardedRef])} {...props}>
      {visible && children}
    </Root>
  )
})
