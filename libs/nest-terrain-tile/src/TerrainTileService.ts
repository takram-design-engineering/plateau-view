import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import sharp, { type Sharp } from 'sharp'

import {
  CachedTileRenderer,
  type Coordinates,
  type TileCache
} from '@takram/plateau-nest-tile-cache'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { TERRAIN_TILE_CACHE, TERRAIN_TILE_MODULE_OPTIONS } from './constants'
import { TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'

function packHeightRGB(value: number, buffer: Buffer, offset: number): void {
  // DEM data is encoded as signed integer, but I prefer unsigned value so
  // that it can be packed to RGB and linearly interpolated. Handle N/A as zero,
  // as they are mostly sea areas.
  // https://maps.gsi.go.jp/development/demtile.html
  const rgb =
    value > 0x800000
      ? value - 0x800001
      : value !== 0x800000
      ? 0x7ffffe + value
      : 0x7fffff
  buffer[offset] = (rgb >> 16) & 0xff
  buffer[offset + 1] = (rgb >> 8) & 0xff
  buffer[offset + 2] = rgb & 0xff
}

@Injectable()
export class TerrainTileService extends CachedTileRenderer {
  private readonly logger = new Logger(TerrainTileService.name)

  readonly byteLength = 256 * 256 * 3
  readonly emptyBuffer: Buffer

  constructor(
    @Inject(TERRAIN_TILE_MODULE_OPTIONS)
    options: TerrainTileModuleOptions,
    @Inject(TERRAIN_TILE_CACHE)
    cache: TileCache | undefined
  ) {
    super({
      path: options.path,
      maximumLevel: 15,
      cache
    })

    this.emptyBuffer = Buffer.alloc(this.byteLength)
    for (let offset = 0; offset < this.byteLength; offset += 3) {
      packHeightRGB(0, this.emptyBuffer, offset)
    }
  }

  override async render({
    x,
    y,
    level
  }: Coordinates): Promise<Sharp | undefined> {
    const formats = ['dem5a_png', 'dem5b_png', 'dem5c_png', 'dem_png']
    const requests = await Promise.allSettled(
      formats.map(
        async format =>
          await axios.get<ArrayBuffer>(
            `https://cyberjapandata.gsi.go.jp/xyz/${format}/${level}/${x}/${y}.png`,
            { responseType: 'arraybuffer' }
          )
      )
    )
    const buffers = (
      await Promise.all(
        requests.map(async result => {
          if (result.status === 'rejected') {
            return
          }
          const buffer = await sharp(result.value.data).raw().toBuffer()
          if (buffer.byteLength < this.byteLength) {
            this.logger.error(
              `Insufficient byte length. Expected ${this.byteLength} but got ${buffer.byteLength}.`
            )
            return
          }
          return buffer
        })
      )
    ).filter(isNotNullish)
    if (buffers.length === 0) {
      return
    }

    const result = Buffer.alloc(this.byteLength)
    for (let offset = 0; offset < this.byteLength; offset += 3) {
      let value: number | undefined
      for (const buffer of buffers) {
        const nextValue =
          (buffer[offset] << 16) |
          (buffer[offset + 1] << 8) |
          buffer[offset + 2]
        if (nextValue !== 0x800000) {
          value = nextValue
          break
        }
      }
      if (value == null) {
        value = 0x800000 // TODO: Look for the parent tile to fill N/A.
      }
      packHeightRGB(value, result, offset)
    }

    return sharp(result, {
      raw: {
        width: 256,
        height: 256,
        channels: 3
      }
    })
  }
}
