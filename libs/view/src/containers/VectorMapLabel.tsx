import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { VectorMapLabel } from '@takram/plateau-vector-map-label'

import { showMapLabelAtom } from '../states/app'

export const MapLabel: FC = () => {
  const showMapLabel = useAtomValue(showMapLabelAtom)
  return showMapLabel && <VectorMapLabel />
}
