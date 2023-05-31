import { type Sharp } from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { type Coordinates } from './interfaces/Coordinates'
import { type TileCache } from './interfaces/TileCache'
import { type TileFormat } from './interfaces/TileFormat'

export interface CachedTileRendererOptions {
  cache: TileCache | undefined
  path: string
  maximumLevel: number
}

export interface RenderTileOptions {
  format?: TileFormat
}

function applyFormat(image: Sharp, format: TileFormat): Sharp {
  return format === 'webp' ? image.webp({ lossless: true }) : image.png()
}

export abstract class CachedTileRenderer {
  readonly cache: TileCache | undefined
  readonly path: string
  readonly maximumLevel: number

  constructor(options: CachedTileRendererOptions) {
    this.cache = options.cache
    this.path = options.path
    this.maximumLevel = options.maximumLevel
  }

  abstract renderTile(coords: Coordinates): Promise<Sharp | undefined>

  async findTile(
    coords: Coordinates,
    { format = 'png' }: RenderTileOptions = {}
  ): Promise<Sharp | Readable | string | undefined> {
    if (coords.level > this.maximumLevel) {
      return
    }
    if (this.cache != null) {
      const cache = await this.cache.get(this.path, coords, format)
      if (cache != null) {
        return cache
      }
    }

    const image = await this.renderTile(coords)
    if (image == null) {
      return
    }

    if (this.cache != null) {
      ;(async () => {
        invariant(this.cache != null)
        await this.cache.set(
          this.path,
          coords,
          format,
          applyFormat(image, format)
        )
      })().catch(error => {
        console.error(error)
      })
    }
    return applyFormat(image, format)
  }
}
