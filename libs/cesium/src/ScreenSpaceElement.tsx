import {
  Cartesian2,
  Cartesian3,
  Ellipsoid,
  EllipsoidalOccluder,
  SceneTransforms
} from '@cesium/engine'
import { styled } from '@mui/material'
import { motion, useMotionValue } from 'framer-motion'
import { forwardRef, useRef, type ComponentPropsWithRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import { useConstant } from '@takram/plateau-react-helpers'

import { useCesium } from './useCesium'
import { usePreRender } from './useSceneEvent'

const Root = styled(motion.div)({
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

  const motionTransform = useMotionValue('')
  const motionDisplay = useMotionValue('none')

  const ref = useRef<HTMLDivElement>(null)
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  usePreRender(() => {
    if (ref.current == null || scene == null) {
      return
    }
    let windowPosition
    try {
      windowPosition = SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        position,
        windowPositionScratch
      )
    } catch (error) {
      motionDisplay.set('none')
      return
    }
    occluder.cameraPosition = scene.camera.position
    if (
      windowPosition == null ||
      windowPosition.x < 0 ||
      windowPosition.y < 0 ||
      windowPosition.x > window.innerWidth ||
      windowPosition.y > window.innerHeight ||
      !occluder.isPointVisible(position)
    ) {
      motionDisplay.set('none')
      return
    }
    const x = `calc(${windowPosition.x}px - 50%)`
    const y = `calc(${windowPosition.y}px - 50%)`
    motionTransform.set(`translate(${x}, ${y})`)
    motionDisplay.set('block')
  })

  return (
    <Root
      ref={mergeRefs([ref, forwardedRef])}
      {...props}
      style={{
        ...props.style,
        transform: motionTransform,
        display: motionDisplay
      }}
    >
      {children}
    </Root>
  )
})
