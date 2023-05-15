import { forwardRef, useEffect } from 'react'

import { useAsyncInstance, useCesium } from '@plateau/cesium'
import { assignForwardedRef, withEphemerality } from '@plateau/react-helpers'

import { AreaDataSource } from './AreaDataSource'

export interface AreaEntitiesProps {
  url: string
  show?: boolean
}

export const AreaEntities = withEphemerality(
  () => useCesium(({ dataSources }) => dataSources),
  ['url'],
  forwardRef<AreaDataSource, AreaEntitiesProps>(
    ({ url, show = true }, forwardedRef) => {
      const dataSources = useCesium(({ dataSources }) => dataSources)
      const dataSource = useAsyncInstance({
        owner: dataSources,
        keys: [url],
        create: async () => {
          const dataSource = await AreaDataSource.fromUrl(url)
          dataSource.show = show
          return dataSource
        },
        transferOwnership: (dataSource, dataSources) => {
          // TODO: Support async transferOwnership perhaps?
          dataSources.add(dataSource).catch(error => {
            console.error(error)
          })
          assignForwardedRef(forwardedRef, dataSource)
          return () => {
            dataSources.remove(dataSource)
            assignForwardedRef(forwardedRef, null)
          }
        }
      })

      if (dataSource != null) {
        dataSource.show = show
      }

      useEffect(() => {
        assignForwardedRef(forwardedRef, dataSource ?? null)
      }, [forwardedRef, dataSource])

      return null
    }
  )
)
