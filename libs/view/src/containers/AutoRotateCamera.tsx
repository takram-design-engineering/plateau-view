import { Cartesian3, Math as CesiumMath } from '@cesium/engine'
import { useAtomValue } from 'jotai'
import { useRef, type FC } from 'react'

import { useCesium, useClockTick } from '@takram/plateau-cesium'
import { getCameraEllipsoidIntersection } from '@takram/plateau-cesium-helpers'

import { autoRotateCameraAtom } from '../states/app'

export interface AutoRotateCameraProps {
  degreesPerMinute?: number
}

const cartesianScratch = new Cartesian3()

const Content: FC<AutoRotateCameraProps> = ({ degreesPerMinute = 180 }) => {
  const radianPerMilliseconds = CesiumMath.toRadians(degreesPerMinute) / 60000
  const dateRef = useRef<number>()
  const scene = useCesium(({ scene }) => scene)
  useClockTick(() => {
    if (dateRef.current == null) {
      dateRef.current = Date.now()
      return
    }
    const now = Date.now()
    const elapsed = now - dateRef.current
    const target = getCameraEllipsoidIntersection(scene, cartesianScratch)
    scene.camera.rotate(target, radianPerMilliseconds * elapsed)
    dateRef.current = now
  })

  return null
}

export const AutoRotateCamera: FC<AutoRotateCameraProps> = props => {
  const enabled = useAtomValue(autoRotateCameraAtom)
  return enabled && <Content {...props} />
}
