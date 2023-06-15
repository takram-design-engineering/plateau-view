import {
  EasingFunction,
  PerspectiveFrustum,
  type BoundingSphere,
  type Scene
} from '@cesium/engine'
import { defaults } from 'lodash'
import invariant from 'tiny-invariant'

import { type FlyToOptions } from './types'

const defaultOptions = {
  duration: 0.5,
  easingFunction: EasingFunction.QUADRATIC_IN_OUT
} satisfies FlyToOptions

export async function flyToBoundingSphere(
  scene: Scene,
  boundingSphere: BoundingSphere,
  options: FlyToOptions = {}
): Promise<void> {
  invariant(scene.camera.frustum instanceof PerspectiveFrustum)
  const range = boundingSphere.radius / Math.sin(scene.camera.frustum.fov / 2)
  await new Promise<void>(resolve => {
    scene.camera.flyToBoundingSphere(boundingSphere, {
      // Prevent camera from animating heading and pitch because it's too
      // immersive.
      // TODO: Fix that heading rotates by 180 deg when pitch is in the vicinity
      // of upright.
      offset: {
        heading: scene.camera.heading,
        pitch: scene.camera.pitch,
        range
      },
      ...defaults({}, options, defaultOptions),
      complete: resolve,
      cancel: resolve
    })
  })
}
