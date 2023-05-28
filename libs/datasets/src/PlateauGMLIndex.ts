import {
  type Cesium3DTile,
  type Cesium3DTileContent,
  type Cesium3DTileFeature
} from '@cesium/engine'

import { forEachTileFeature } from '@takram/plateau-cesium-helpers'

export function getGmlId(feature: Cesium3DTileFeature): string | undefined {
  try {
    // Version 2020 stores GML id in "_gml_id" while 2022 stores in "gml_id".
    return feature.getProperty('gml_id') ?? feature.getProperty('_gml_id')
  } catch (error) {
    return undefined
  }
}

interface IndexRecord {
  content: Cesium3DTileContent
  batchId: number
}

export class PlateauGMLIndex {
  // Because refinement is replacement in version 2022 tilesets, I have to
  // expect multiple features of the same GML id.
  private readonly records: Record<string, IndexRecord[]> = {}

  has(gmlId: string): boolean {
    return this.records[gmlId] != null
  }

  find(gmlId: string): Cesium3DTileFeature[] | undefined {
    const record = this.records[gmlId]
    if (record == null) {
      return
    }
    return record.map(({ content, batchId }) => content.getFeature(batchId))
  }

  addTile(tile: Cesium3DTile): void {
    forEachTileFeature(tile, (feature, batchId) => {
      this.addFeature(tile.content, feature, batchId)
    })
  }

  addFeature(
    content: Cesium3DTileContent,
    feature: Cesium3DTileFeature,
    batchId: number
  ): void {
    const id = getGmlId(feature)
    if (id == null) {
      return
    }
    if (this.records[id] == null) {
      this.records[id] = [{ content, batchId }]
    } else {
      const record = this.records[id]
      record.push({ content, batchId })
    }
  }
}
