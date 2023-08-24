import {
  DiscardEmptyTileImagePolicy,
  type ImageryTypes,
  type Request
} from '@cesium/engine'
import { TileCache, ZxySource } from 'protomaps'

import {
  ImageryProviderBase,
  type ImageryProviderBaseOptions
} from '@takram/plateau-cesium-helpers'

export interface LabelImageryProviderOptions
  extends ImageryProviderBaseOptions {
  url: string
}

export class LabelImageryProvider extends ImageryProviderBase {
  minimumDataLevel = this.minimumLevel

  readonly tileCache: TileCache
  private readonly image: HTMLCanvasElement
  private readonly discardedTileCoords = new Set<string>()

  constructor(options: LabelImageryProviderOptions) {
    super(options)
    this.tileDiscardPolicy = new DiscardEmptyTileImagePolicy()

    const source = new ZxySource(options.url, false)
    this.tileCache = new TileCache(source, 1024)

    this.image = document.createElement('canvas')
    this.image.width = 1
    this.image.height = 1
  }

  requestImage(
    x: number,
    y: number,
    level: number,
    request?: Request | undefined
  ): Promise<ImageryTypes> | undefined {
    const key = `${x}:${y}:${level}`
    return (async () => {
      if (level < this.minimumDataLevel || this.discardedTileCoords.has(key)) {
        return DiscardEmptyTileImagePolicy.EMPTY_IMAGE
      }
      // Populate tile cache in advance.
      await this.tileCache.get({ x, y, z: level })
      return this.image
    })().catch(() => {
      this.discardedTileCoords.add(key)
      return DiscardEmptyTileImagePolicy.EMPTY_IMAGE
    })
  }
}
