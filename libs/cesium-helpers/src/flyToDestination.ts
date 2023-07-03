import {
  EasingFunction,
  PerspectiveFrustum,
  type Cartesian3,
  type HeadingPitchRoll,
  type HeadingPitchRollValues,
  type Rectangle,
  type Scene
} from '@cesium/engine'
import {
  animate,
  motionValue,
  type AnimationPlaybackControls
} from 'framer-motion'
import { defaults } from 'lodash'
import invariant from 'tiny-invariant'

import { type FlyToOptions } from './types'

const defaultOptions = {
  duration: 0.5,
  easingFunction: EasingFunction.QUADRATIC_IN_OUT
} satisfies FlyToOptions

export async function flyToDestination(
  scene: Scene,
  destination: Cartesian3 | Rectangle,
  headingPitchRoll?:
    | HeadingPitchRoll
    | (HeadingPitchRollValues & {
        fov?: number
      }),
  options: FlyToOptions = {}
): Promise<void> {
  await new Promise<void>(resolve => {
    const resolvedOptions = defaults({}, options, defaultOptions)

    let animationControl: AnimationPlaybackControls | undefined
    if (
      headingPitchRoll != null &&
      'fov' in headingPitchRoll &&
      headingPitchRoll.fov != null
    ) {
      const frustum = scene.camera.frustum
      invariant(frustum instanceof PerspectiveFrustum)
      const motionFov = motionValue(frustum.fov)
      animationControl = animate(motionFov, headingPitchRoll.fov, {
        type: 'tween',
        ease: resolvedOptions.easingFunction,
        duration: resolvedOptions.duration,
        onUpdate: fov => {
          frustum.fov = fov
        }
      })
    }

    scene.camera.flyTo({
      destination,
      orientation: {
        heading: scene.camera.heading,
        pitch: scene.camera.pitch,
        roll: scene.camera.roll,
        ...headingPitchRoll
      },
      ...resolvedOptions,
      complete: resolve,
      cancel: () => {
        animationControl?.stop()
        resolve()
      }
    })
  })
}
