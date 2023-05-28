import { type Cesium3DTile, type Cesium3DTileFeature } from '@cesium/engine'

export function forEachTileFeature(
  tile: Cesium3DTile,
  callback: (feature: Cesium3DTileFeature, batchId: number) => void
): void {
  for (let batchId = 0; batchId < tile.content.featuresLength; ++batchId) {
    callback(tile.content.getFeature(batchId), batchId)
  }
}
