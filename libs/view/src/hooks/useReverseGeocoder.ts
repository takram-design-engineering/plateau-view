import { Cartesian3, Cartographic, Math as CesiumMath } from '@cesium/engine'
import { useRef, useState } from 'react'

import { useCameraEvent, useCesium } from '@plateau/cesium'
import { getCameraEllipsoidIntersection } from '@plateau/cesium-helpers'
import { type Address } from '@plateau/gsi-geocoder'
import { useConstant } from '@plateau/react-helpers'
import { type CancelablePromise } from '@plateau/type-helpers'

export type AddressComponent = 'prefecture' | 'municipality' | null

export interface ReverseGeocoderOptions<T extends AddressComponent> {
  component?: T
}

export type ReverseGeocoderResult<T extends AddressComponent = null> =
  T extends 'prefecture'
    ? Pick<Address, 'prefectureCode' | 'prefectureName'>
    : T extends 'municipality'
    ? Omit<Address, 'name'>
    : Address

export function useReverseGeocoder<T extends AddressComponent = null>(
  options?: ReverseGeocoderOptions<T>
): ReverseGeocoderResult<T> | undefined

export function useReverseGeocoder({
  component = null
}: ReverseGeocoderOptions<AddressComponent> = {}):
  | ReverseGeocoderResult<AddressComponent>
  | undefined {
  const cartesian = useConstant(() => new Cartesian3())
  const cartographic = useConstant(() => new Cartographic())

  const scene = useCesium(({ scene }) => scene, { indirect: true })

  const promiseRef = useRef<CancelablePromise<void>>()
  const [address, setAddress] = useState<Address>()

  const callback = (): void => {
    if (scene == null) {
      return
    }
    promiseRef.current?.cancel()
    getCameraEllipsoidIntersection(scene, cartesian)
    Cartographic.fromCartesian(cartesian, scene.globe.ellipsoid, cartographic)
    const coords = {
      longitude: CesiumMath.toDegrees(cartographic.longitude),
      latitude: CesiumMath.toDegrees(cartographic.latitude)
    }

    let canceled = false
    const controller = new AbortController()
    const promise = (async () => {
      const { getAddress } = await import('@plateau/gsi-geocoder')
      const next = await getAddress(coords, { signal: controller.signal })
      if (canceled) {
        return
      }
      setAddress(prev => {
        switch (component) {
          case 'prefecture':
            if (next?.prefectureCode === prev?.prefectureCode) {
              return prev
            }
          // fall through
          case 'municipality':
            if (next?.municipalityCode === prev?.municipalityCode) {
              return prev
            }
          // fall through
          case null:
            if (next?.name === prev?.name) {
              return prev
            }
            return next
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

  return address
}
