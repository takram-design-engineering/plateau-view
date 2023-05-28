import {
  type Cesium3DTile,
  type Cesium3DTileContent,
  type Cesium3DTileFeature
} from '@cesium/engine'

import { forEachTileFeature } from '@takram/plateau-cesium-helpers'

interface IndexRecord {
  content: Cesium3DTileContent
  batchId: number
}

export class TileFeatureIndex {
  private readonly records = new Map<string, IndexRecord[]>()

  has(key: string): boolean {
    return this.records.has(key)
  }

  find(key: string): Cesium3DTileFeature[] | undefined {
    const record = this.records.get(key)
    if (record == null) {
      return
    }
    return record.map(({ content, batchId }) => content.getFeature(batchId))
  }

  addTile(
    tile: Cesium3DTile,
    getKey: (feature: Cesium3DTileFeature) => string | undefined
  ): void {
    forEachTileFeature(tile, (feature, batchId) => {
      this.addFeature(tile.content, batchId, getKey(feature))
    })
  }

  addFeature(
    content: Cesium3DTileContent,
    batchId: number,
    key?: string
  ): void {
    if (key == null) {
      return
    }
    const record = this.records.get(key)
    if (record == null) {
      this.records.set(key, [{ content, batchId }])
    } else {
      record.push({ content, batchId })
    }
  }
}
