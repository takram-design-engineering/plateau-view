import {
  Cartesian3,
  Math as CesiumMath,
  PerspectiveFrustum
} from '@cesium/engine'
import {
  animate,
  motionValue,
  type ValueAnimationTransition
} from 'framer-motion'
import { atom, type PrimitiveAtom, type SetStateAction } from 'jotai'
import { debounce } from 'lodash'
import { useMemo, useRef } from 'react'
import invariant from 'tiny-invariant'

import { useCesium } from '@takram/plateau-cesium'
import { flyToDestination } from '@takram/plateau-cesium-helpers'

import { computeCartographicToCartesian } from './computeCartographicToCartesian'
import { getFieldOfView } from './getFieldOfView'
import { type HeadingPitch, type HeadingPitchFov, type Location } from './types'

export interface StreetViewStateParams {
  locationAtom: PrimitiveAtom<Location>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
  synchronizedAtom: PrimitiveAtom<boolean>
}

export interface StreetViewState {
  locationAtom: PrimitiveAtom<Location>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
  synchronizedAtom: PrimitiveAtom<boolean>
}

interface CameraState {
  position: Cartesian3
  headingPitchFov: HeadingPitchFov
}

const cartesianScratch = new Cartesian3()

export function useSynchronizeStreetView(
  params: StreetViewStateParams
): StreetViewState {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const sceneRef = useRef(scene)
  sceneRef.current = scene

  const paramsRef = useRef(params)
  paramsRef.current = params

  return useMemo(() => {
    const locationAtom = atom(
      get => get(paramsRef.current.locationAtom),
      (get, set, value: SetStateAction<Location>) => {
        const params = paramsRef.current
        const prevValue = get(params.locationAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.locationAtom, nextValue)

        const synchronized = get(params.synchronizedAtom)
        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (synchronized) {
          if (prevValue != null) {
            const prevPosition = computeCartographicToCartesian(
              scene,
              prevValue,
              cartesianScratch
            )
            const motionX = motionValue(prevPosition.x)
            const motionY = motionValue(prevPosition.y)
            const motionZ = motionValue(prevPosition.z)

            const options: ValueAnimationTransition<number> = {
              type: 'tween',
              ease: 'easeInOut',
              duration: 0.3,
              onUpdate: debounce(() => {
                scene.camera.position.x = motionX.get()
                scene.camera.position.y = motionY.get()
                scene.camera.position.z = motionZ.get()
              })
            }

            const nextPosition = computeCartographicToCartesian(
              scene,
              nextValue,
              cartesianScratch
            )
            void animate(motionX, nextPosition.x, options)
            void animate(motionY, nextPosition.y, options)
            void animate(motionZ, nextPosition.z, options)
          } else {
            computeCartographicToCartesian(
              scene,
              nextValue,
              scene.camera.position
            )
          }
        }
      }
    )

    const headingPitchAtom = atom(
      get => get(paramsRef.current.headingPitchAtom),
      (get, set, value: SetStateAction<HeadingPitch | null>) => {
        const params = paramsRef.current
        const prevValue = get(params.headingPitchAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.headingPitchAtom, nextValue)

        const synchronized = get(params.synchronizedAtom)
        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (synchronized) {
          scene.camera.setView({
            orientation: {
              heading: CesiumMath.toRadians(nextValue.heading),
              pitch: CesiumMath.toRadians(nextValue.pitch)
            }
          })
        }
      }
    )

    const zoomAtom = atom(
      get => get(paramsRef.current.zoomAtom),
      (get, set, value: SetStateAction<number | null>) => {
        const params = paramsRef.current
        const prevValue = get(params.zoomAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.zoomAtom, nextValue)

        const synchronized = get(params.synchronizedAtom)
        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (synchronized) {
          const frustum = scene.camera.frustum
          invariant(frustum instanceof PerspectiveFrustum)
          frustum.fov = getFieldOfView(scene.camera, nextValue)
        }
      }
    )

    const cameraStateAtom = atom<CameraState | null>(null)

    const synchronizedAtom = atom(
      get => get(paramsRef.current.synchronizedAtom),
      (get, set, value: SetStateAction<boolean>) => {
        const params = paramsRef.current
        const prevValue = get(params.synchronizedAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.synchronizedAtom, nextValue)

        const scene = sceneRef.current
        if (scene == null) {
          return
        }
        if (nextValue) {
          // Remember the current camera's heading, pitch and roll to restore
          // them later.
          const frustum = scene.camera.frustum
          invariant(frustum instanceof PerspectiveFrustum)
          set(cameraStateAtom, {
            position: scene.camera.position.clone(),
            headingPitchFov: {
              heading: scene.camera.heading,
              pitch: scene.camera.pitch,
              fov: frustum.fov
            }
          })

          const location = get(params.locationAtom)
          const headingPitch = get(params.headingPitchAtom)
          const zoom = get(params.zoomAtom)
          if (location == null || headingPitch == null || zoom == null) {
            return
          }
          const position = computeCartographicToCartesian(scene, location)
          void flyToDestination(scene, position, {
            heading: CesiumMath.toRadians(headingPitch.heading),
            pitch: CesiumMath.toRadians(headingPitch.pitch),
            fov: getFieldOfView(scene.camera, zoom)
          })
        } else {
          const state = get(cameraStateAtom)
          if (state == null) {
            console.warn(
              'Camera state before synchronization unexpectedly not found.'
            )
            return
          }
          void flyToDestination(scene, state.position, state.headingPitchFov)
        }
      }
    )

    return {
      synchronizedAtom,
      locationAtom,
      headingPitchAtom,
      zoomAtom
    }
  }, [])
}
