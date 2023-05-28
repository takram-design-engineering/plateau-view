import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, type FC } from 'react'

import { useReverseGeocoder } from '../hooks/useReverseGeocoder'
import { addressAtom } from '../states/address'
import { readyAtom } from '../states/app'

export const ReverseGeocoding: FC = () => {
  const address = useReverseGeocoder()
  const setAddress = useSetAtom(addressAtom)
  const ready = useAtomValue(readyAtom)
  useEffect(() => {
    if (ready) {
      setAddress(address ?? null)
    }
  }, [address, setAddress, ready])
  return null
}
