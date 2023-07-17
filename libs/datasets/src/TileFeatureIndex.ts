import {
  type Cesium3DTile,
  type Cesium3DTileContent,
  type Cesium3DTileFeature
} from '@cesium/engine'
import moji from 'moji'

import { forEachTileFeature } from '@takram/plateau-cesium-helpers'

export function cleanseName(text: string): string {
  return moji(text)
    .convert('ZE', 'HE')
    .convert('ZS', 'HS')
    .convert('HK', 'ZK')
    .toString()
    .replace(/ +/g, ' ')
    .replace(/([^ ])\(/g, '$1 (')
    .replace(/\)([^ ])/g, ') $1')
    .trim()
}

interface IndexRecord {
  content: Cesium3DTileContent
  batchId: number
}

interface FeatureRecord {
  feature: Cesium3DTileFeature
  name: string
  longitude: number
  latitude: number
}

export class TileFeatureIndex {
  private readonly records = new Map<string, IndexRecord[]>()
  readonly #features: FeatureRecord[] = []

  get features(): ReadonlyArray<Readonly<FeatureRecord>> {
    return this.#features
  }

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

    const feature = content.getFeature(batchId)
    // Only PLATEAU 2020 datasets are supported.
    const name: string | undefined = feature.getProperty('名称')
    const longitude: number | undefined = feature.getProperty('_x')
    const latitude: number | undefined = feature.getProperty('_y')
    if (name == null || longitude == null || latitude == null) {
      return
    }
    this.#features.push({
      feature,
      name: cleanseName(name),
      longitude,
      latitude
    })
  }
}
