import {
  Cartesian3,
  Cartographic,
  Math as CesiumMath,
  PerspectiveFrustum
} from '@cesium/engine'
import { useRef, useState } from 'react'
import invariant from 'tiny-invariant'

import { useCameraEvent, useCesium } from '@plateau/cesium'
import { getCameraEllipsoidIntersection } from '@plateau/cesium-helpers'
import type { Address } from '@plateau/gsi-geocoder'
import { useConstant } from '@plateau/react-helpers'
import { type CancelablePromise } from '@plateau/type-helpers'

export type ReverseGeocoderResult = Address<true>

export function useReverseGeocoder(): ReverseGeocoderResult | undefined {
  const cartesian = useConstant(() => new Cartesian3())
  const cartographic = useConstant(() => new Cartographic())

  const scene = useCesium(({ scene }) => scene, { indirect: true })

  const promiseRef = useRef<CancelablePromise<void>>()
  const [result, setResult] = useState<ReverseGeocoderResult>()

  const callback = (): void => {
    if (scene == null) {
      return
    }
    promiseRef.current?.cancel()
    getCameraEllipsoidIntersection(scene, cartesian)
    const ellipsoid = scene.globe.ellipsoid
    Cartographic.fromCartesian(cartesian, ellipsoid, cartographic)
    const coords = {
      longitude: CesiumMath.toDegrees(cartographic.longitude),
      latitude: CesiumMath.toDegrees(cartographic.latitude)
    }

    // Define area radii threshold based on frustum radius at the intersection
    // point derived above.
    const camera = scene.camera
    const frustum = camera.frustum
    invariant(frustum instanceof PerspectiveFrustum)
    const distance = Cartesian3.distance(camera.positionWC, cartesian)
    const threshold = distance * Math.tan(frustum.fov / 2) * 0.5

    let canceled = false
    const controller = new AbortController()
    const promise = (async () => {
      const { getAddress } = await import('@plateau/gsi-geocoder')
      const next = await getAddress(coords, {
        includeRadii: true,
        signal: controller.signal
      })
      if (canceled) {
        return
      }
      setResult(prev => {
        if (next == null) {
          return
        }
        const areas = next.areas.filter(area => area.radius > threshold)
        if (areas.length === 0) {
          return
        }
        return {
          areas,
          address: next.address
        }
      })
    })().catch(error => {
      console.error(error)
    })
    promiseRef.current = Object.assign(promise, {
      cancel: () => {
        controller.abort()
        canceled = true
      }
    })
  }

  // Frequency of changed events are controlled by Camera.percentageChanged
  // globally. I don't want to adjust it just for this. Look for the end of
  // camera movements instead.
  useCameraEvent('changed', callback)
  useCameraEvent('moveEnd', callback)

  return result
}
