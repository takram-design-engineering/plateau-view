import { Math as CesiumMath, PerspectiveFrustum } from '@cesium/engine'
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

import { getFieldOfView } from './getFieldOfView'
import { getPosition } from './getPosition'
import { type HeadingPitch, type Location } from './types'

export interface StreetViewStateParams {
  synchronizeAtom: PrimitiveAtom<boolean>
  locationAtom: PrimitiveAtom<Location | null>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
}

export interface StreetViewState {
  synchronizeAtom: PrimitiveAtom<boolean>
  locationAtom: PrimitiveAtom<Location | null>
  headingPitchAtom: PrimitiveAtom<HeadingPitch | null>
  zoomAtom: PrimitiveAtom<number | null>
}

export function useStreetViewState(
  params: StreetViewStateParams
): StreetViewState {
  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const sceneRef = useRef(scene)
  sceneRef.current = scene

  const paramsRef = useRef(params)
  paramsRef.current = params

  return useMemo(() => {
    const synchronizeAtom = atom(
      get => get(paramsRef.current.synchronizeAtom),
      (get, set, value: SetStateAction<boolean>) => {
        const params = paramsRef.current
        const prevValue = get(params.synchronizeAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.synchronizeAtom, nextValue)

        const scene = sceneRef.current
        if (!nextValue || scene == null) {
          return
        }
        const location = get(params.locationAtom)
        const headingPitch = get(params.headingPitchAtom)
        const zoom = get(params.zoomAtom)
        if (location == null || headingPitch == null || zoom == null) {
          return
        }
        const position = getPosition(scene, location)
        void flyToDestination(scene, position, {
          heading: CesiumMath.toRadians(headingPitch.heading),
          pitch: CesiumMath.toRadians(headingPitch.pitch),
          fov: getFieldOfView(scene, zoom)
        })
      }
    )

    const locationAtom = atom(
      get => get(paramsRef.current.locationAtom),
      (get, set, value: SetStateAction<Location | null>) => {
        const params = paramsRef.current
        const prevValue = get(params.locationAtom)
        const nextValue = typeof value === 'function' ? value(prevValue) : value
        set(params.locationAtom, nextValue)

        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (get(params.synchronizeAtom)) {
          if (prevValue != null) {
            const motionLongitude = motionValue(prevValue.longitude)
            const motionLatitude = motionValue(prevValue.latitude)
            const motionHeight = motionValue(prevValue.height ?? 0)

            const options: ValueAnimationTransition<number> = {
              type: 'tween',
              ease: 'easeInOut',
              duration: 0.3,
              onUpdate: debounce(() => {
                getPosition(
                  scene,
                  {
                    longitude: motionLongitude.get(),
                    latitude: motionLatitude.get(),
                    height: motionHeight.get()
                  },
                  scene.camera.position
                )
              })
            }

            void animate(motionLongitude, nextValue.longitude, options)
            void animate(motionLatitude, nextValue.latitude, options)
            void animate(motionHeight, nextValue.height ?? 0, options)
          } else {
            getPosition(scene, nextValue, scene.camera.position)
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

        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (get(params.synchronizeAtom)) {
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

        const scene = sceneRef.current
        if (nextValue == null || scene == null) {
          return
        }
        if (get(params.synchronizeAtom)) {
          const frustum = scene.camera.frustum
          invariant(frustum instanceof PerspectiveFrustum)
          frustum.fov = getFieldOfView(scene, nextValue)
        }
      }
    )

    return {
      synchronizeAtom,
      locationAtom,
      headingPitchAtom,
      zoomAtom
    }
  }, [])
}
