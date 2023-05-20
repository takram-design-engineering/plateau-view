import {
  Credit,
  Rectangle,
  type ImageryTypes,
  type Request
} from '@cesium/engine'
import { LRUCache } from 'lru-cache'
import { type Zxy } from 'protomaps'
import { Transfer } from 'threads'
import invariant from 'tiny-invariant'
import { type JsonObject } from 'type-fest'

import { ImageryProviderBase } from '@plateau/cesium'

import { type TileRendererParams } from './VectorTileRenderWorker'
import { getWorkerPool } from './WorkerPool'

export interface VectorImageryProviderOptions {
  url: string
  style?: string | JsonObject
  minimumZoom?: number
  maximumZoom?: number
  maximumDataZoom?: number
  zoomDifference?: number
  pixelRatio?: number
  rectangle?: Rectangle
  credit?: Credit | string
  cacheSize?: number
  useWorkerPool?: boolean
}

export class VectorImageryProvider extends ImageryProviderBase {
  readonly pixelRatio: number

  private readonly tileRendererParams: TileRendererParams
  private readonly tileCache: LRUCache<string, HTMLCanvasElement> | undefined

  constructor(options: VectorImageryProviderOptions) {
    super()
    this.minimumLevel = options.minimumZoom ?? 0
    this.maximumLevel = options.maximumZoom ?? 24
    this.pixelRatio = options.pixelRatio ?? 1
    this.tileRendererParams = {
      url: options.url,
      style: options.style,
      maximumZoom: options.maximumDataZoom ?? this.maximumLevel,
      zoomDifference: options.zoomDifference
    }

    this.rectangle =
      options.rectangle != null
        ? Rectangle.intersection(
            options.rectangle,
            this.tilingScheme.rectangle
          ) ?? this.tilingScheme.rectangle
        : this.tilingScheme.rectangle

    this.credit =
      typeof options.credit === 'string'
        ? new Credit(options.credit)
        : (options.credit as Credit) // Credit can be undefined

    if (options.cacheSize !== 0) {
      this.tileCache = new LRUCache({ max: options.cacheSize ?? 500 })
    }
  }

  override async requestImage(
    x: number,
    y: number,
    level: number,
    request?: Request
  ): Promise<ImageryTypes> {
    const cacheKey = `${x}/${y}/${level}`
    if (this.tileCache?.has(cacheKey) === true) {
      const canvas = this.tileCache.get(cacheKey)
      invariant(canvas != null)
      return canvas
    }
    const canvas = document.createElement('canvas')
    canvas.width = this.tileWidth * this.pixelRatio
    canvas.height = this.tileHeight * this.pixelRatio
    const offscreen = canvas.transferControlToOffscreen()
    try {
      await this.renderTile({ x, y, z: level }, offscreen)
    } catch (error) {}
    this.tileCache?.set(cacheKey, canvas)
    return canvas
  }

  async renderTile(coords: Zxy, canvas: OffscreenCanvas): Promise<void> {
    // TODO: Prioritize tiles in the current frustum.
    await getWorkerPool().queue(async task => {
      await task.renderTile(
        Transfer(
          {
            ...this.tileRendererParams,
            coords,
            canvas
          },
          [canvas]
        )
      )
    })
  }
}
