import { BoundingSphere, Cartesian3, type Scene } from '@cesium/engine'

import { flyToBoundingSphere } from '@plateau/cesium-helpers'
import { type AreaDataSource } from '@plateau/data-sources'
import { JapanSeaLevelEllipsoid } from '@plateau/datasets'

const boundingSphereScratch = new BoundingSphere()

export async function flyToArea(
  scene: Scene,
  dataSource: AreaDataSource,
  code: string
): Promise<void> {
  const feature = dataSource.getFeature(code)
  if (feature == null) {
    return
  }
  Cartesian3.fromDegrees(
    ...feature.properties.poleOfInaccessibility,
    0,
    JapanSeaLevelEllipsoid,
    boundingSphereScratch.center
  )
  boundingSphereScratch.radius = feature.properties.radius
  await flyToBoundingSphere(scene, boundingSphereScratch)
}
