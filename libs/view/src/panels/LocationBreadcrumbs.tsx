import { useAtomValue } from 'jotai'
import { useCallback, type FC, type MouseEvent } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { flyToArea } from '@takram/plateau-data-sources'
import {
  AppBreadcrumbs,
  AppBreadcrumbsItem
} from '@takram/plateau-ui-components'

import { useLocationContextState } from '../hooks/useLocationContextState'
import { areaDataSourceAtom } from '../states/address'

export const LocationBreadcrumbs: FC = () => {
  const { areas, focusedAreaCode, focusArea } = useLocationContextState()

  const scene = useCesium(({ scene }) => scene, { indirect: true })
  const dataSource = useAtomValue(areaDataSourceAtom)

  // TODO: Handle in atoms and make them declarative.
  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (areas == null) {
        return
      }
      const reverseIndex = event.currentTarget.dataset.reverseIndex
      if (reverseIndex == null) {
        return
      }
      const area = areas[areas.length - 1 - +reverseIndex]
      if (
        (focusedAreaCode != null && area.code !== focusedAreaCode) ||
        (focusedAreaCode == null && +reverseIndex !== areas.length - 1)
      ) {
        focusArea(area.code)
        return
      }
      if (dataSource == null || scene == null) {
        return
      }
      const entities = dataSource.getEntities(area.code)
      if (entities != null) {
        void flyToArea(scene, dataSource, area.code)
      }
    },
    [areas, focusedAreaCode, focusArea, scene, dataSource]
  )

  if (areas == null) {
    return null
  }
  return (
    <AppBreadcrumbs>
      {[...areas].reverse().map((area, index, { length }) => (
        <AppBreadcrumbsItem
          key={area.code}
          selected={
            (focusedAreaCode != null && area.code === focusedAreaCode) ||
            (focusedAreaCode == null && index === length - 1)
          }
          onClick={handleClick}
          data-reverse-index={index}
        >
          {area.name}
        </AppBreadcrumbsItem>
      ))}
    </AppBreadcrumbs>
  )
}
