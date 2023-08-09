import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { AppBreadcrumbs } from '@takram/plateau-ui-components'

import { areasAtom } from '../states/address'
import { LocationBreadcrumbItem } from './LocationBreadcrumbItem'

export const LocationBreadcrumbs: FC = () => {
  const areas = useAtomValue(areasAtom)
  if (areas == null) {
    return null
  }
  return (
    <AppBreadcrumbs>
      {[...areas].reverse().map(area => (
        <LocationBreadcrumbItem key={area.code} area={area} />
      ))}
    </AppBreadcrumbs>
  )
}
