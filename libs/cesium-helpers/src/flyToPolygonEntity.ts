import {
  BoundingSphere,
  JulianDate,
  type Entity,
  type PolygonHierarchy,
  type Scene
} from '@cesium/engine'

import { flyToBoundingSphere } from './flyToBoundingSphere'
import { type FlyToOptions } from './types'

const timeScratch = new JulianDate()
const boundingSphereScratch = new BoundingSphere()

export async function flyToPolygonEntity(
  scene: Scene,
  entity: Entity | readonly Entity[],
  options?: FlyToOptions
): Promise<void> {
  const time = JulianDate.now(timeScratch)
  const points = (Array.isArray(entity) ? entity : [entity]).flatMap(entity => {
    if (entity.polygon?.hierarchy == null) {
      return []
    }
    const hierarchy: PolygonHierarchy = entity.polygon.hierarchy.getValue(time)
    return hierarchy.positions
  })
  const boundingSphere = BoundingSphere.fromPoints(
    points,
    boundingSphereScratch
  )
  await flyToBoundingSphere(scene, boundingSphere, options)
}
