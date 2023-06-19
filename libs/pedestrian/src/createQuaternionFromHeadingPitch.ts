import {
  Math as CesiumMath,
  HeadingPitchRoll,
  Quaternion,
  Transforms,
  type Cartesian3
} from '@cesium/engine'

import { type HeadingPitch } from './types'

const headingPitchRollScratch = new HeadingPitchRoll()

export function createQuaternionFromHeadingPitch(
  headingPitch: HeadingPitch,
  position: Cartesian3,
  result = new Quaternion()
): Quaternion {
  const heading = CesiumMath.toRadians(headingPitch.heading)
  const pitch = CesiumMath.toRadians(headingPitch.pitch)
  headingPitchRollScratch.heading = heading + CesiumMath.PI_OVER_TWO
  headingPitchRollScratch.pitch = CesiumMath.PI_OVER_TWO - pitch
  return Transforms.headingPitchRollQuaternion(
    position,
    headingPitchRollScratch,
    undefined,
    undefined,
    result
  )
}
