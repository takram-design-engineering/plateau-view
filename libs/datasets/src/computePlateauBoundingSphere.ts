import {
  BoundingSphere,
  Cartographic,
  Math as CesiumMath,
  type Cesium3DTileFeature
} from '@cesium/engine'

const cartographicScratch = new Cartographic()

export function computePlateauBoundingSphere(
  features: readonly Cesium3DTileFeature[],
  result = new BoundingSphere()
): BoundingSphere | undefined {
  // TODO: Do I have to the bounding sphere of all the features?
  const [feature] = features

  // I cannot find the way to access glTF buffer. Try approximate bounding
  // sphere by property values, but PLATEAU 2022 tilesets don't have
  // coordinates information in their properties. Only PLATEAU 2020
  // datasets are supported.
  const x: number | undefined = feature.getProperty('_x')
  const y: number | undefined = feature.getProperty('_y')
  const z: number | undefined = feature.getProperty('_z')
  const height: number | undefined = feature.getProperty('_height')
  if (x == null || y == null || z == null || height == null) {
    return undefined
  }
  cartographicScratch.longitude = CesiumMath.toRadians(x)
  cartographicScratch.latitude = CesiumMath.toRadians(y)
  cartographicScratch.height = z
  Cartographic.toCartesian(cartographicScratch, undefined, result.center)
  result.radius = height / 2
  return result
}
