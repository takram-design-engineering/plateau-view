import { BoundingSphere, Cartesian3, type Scene } from '@cesium/engine'

import { flyToBoundingSphere } from '@plateau/cesium-helpers'
import { type AreaDataSource } from '@plateau/data-sources'

const boundingSphereScratch = new BoundingSphere()

export async function flyToArea(
  scene: Scene,
  dataSource: AreaDataSource,
  code: string
): Promise<void> {
  const feature = dataSource.findFeature(code)
  if (feature == null) {
    return
  }
  Cartesian3.fromElements(
    ...feature.properties.center,
    boundingSphereScratch.center
  )
  boundingSphereScratch.radius = feature.properties.radius
  await flyToBoundingSphere(scene, boundingSphereScratch)
}
