import { useAtomValue } from 'jotai'
import { mapValues } from 'lodash'
import dynamic from 'next/dynamic'
import { Suspense, useMemo, type FC } from 'react'

import { showMapLabelAtom } from '../states/app'

const VectorMapLabel = dynamic(
  async () => (await import('@takram/plateau-vector-map-label')).VectorMapLabel,
  { ssr: false }
)

export const MapLabel: FC = () => {
  const showMapLabel = useAtomValue(showMapLabelAtom)
  const style = useMemo(
    () => mapValues(showMapLabel, value => value && {}),
    [showMapLabel]
  )
  console.log(style)
  return (
    Object.values(showMapLabel).some(value => value) && (
      <Suspense>
        <VectorMapLabel style={style} />
      </Suspense>
    )
  )
}
