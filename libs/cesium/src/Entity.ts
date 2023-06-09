import { Entity as CesiumEntity, type EntityCollection } from '@cesium/engine'
import { omit } from 'lodash'
import { forwardRef, memo, useEffect, useState } from 'react'

import { assignForwardedRef } from '@takram/plateau-react-helpers'

import { requestRenderInNextFrame } from './requestRenderInNextFrame'
import { useCesium } from './useCesium'

export interface EntityProps extends CesiumEntity.ConstructorOptions {
  entities?: EntityCollection
}

export const Entity = memo(
  forwardRef<CesiumEntity, EntityProps>(
    ({ entities: entitiesProp, ...options }, ref) => {
      const scene = useCesium(({ scene }) => scene)
      const defaultEntities = useCesium(({ entities }) => entities)
      const entities = entitiesProp ?? defaultEntities
      const [entity, setEntity] = useState(() => new CesiumEntity(options))

      useEffect(() => {
        setEntity(new CesiumEntity(options))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [options.id])

      useEffect(() => {
        entities.add(entity)
        requestRenderInNextFrame(scene)
        return () => {
          entities.remove(entity)
          scene.requestRender()
        }
      }, [scene, entities, entity])

      useEffect(() => assignForwardedRef(ref, entity), [ref, entity])

      // Although it seems Entity.merge() is the way to merge with the new
      // options, Object.assign() also works.
      Object.assign(entity, omit(options, 'id'))

      scene.requestRender()

      return null
    }
  )
)
