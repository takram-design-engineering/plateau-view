import { type FC } from 'react'

import { AppBreadcrumbs } from '@takram/plateau-ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { LocationBreadcrumbItem } from './LocationBreadcrumbItem'

export const LocationBreadcrumbs: FC = () => {
  const { areas } = useLocationContextState()
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
