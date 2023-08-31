import { useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'
import { Suspense, type FC } from 'react'

import { showMapLabelAtom } from '../states/app'

const VectorMapLabel = dynamic(
  async () => (await import('@takram/plateau-vector-map-label')).VectorMapLabel,
  { ssr: false }
)

export const MapLabel: FC = () => {
  const showMapLabel = useAtomValue(showMapLabelAtom)
  return (
    showMapLabel && (
      <Suspense>
        <VectorMapLabel />
      </Suspense>
    )
  )
}
