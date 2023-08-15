import { useEffect, useState } from 'react'

import type { Address } from '@takram/plateau-geocoder'

export interface UseAddressParams {
  longitude?: number
  latitude?: number
}

export function useAddress({
  longitude,
  latitude
}: UseAddressParams): Address | undefined {
  const [result, setResult] = useState<Address>()

  useEffect(() => {
    let canceled = false
    const controller = new AbortController()

    ;(async () => {
      if (longitude == null || latitude == null) {
        setResult(undefined)
        return
      }
      const { getAddress } = await import('@takram/plateau-geocoder')
      const next = await getAddress(
        { longitude, latitude },
        { signal: controller.signal }
      )
      if (canceled) {
        return
      }
      setResult(next)
    })().catch(error => {
      console.error(error)
    })

    return () => {
      controller.abort()
      canceled = true
    }
  }, [longitude, latitude])

  return result
}
