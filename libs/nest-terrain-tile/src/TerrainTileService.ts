import { type Rectangle } from '@cesium/engine'
import { Inject, Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import sharp from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { importCesium } from '@takram/plateau-nest-cesium'
import {
  TileCacheService,
  type Coordinates,
  type RenderTileOptions
} from '@takram/plateau-nest-tile-cache'
import { isNotNullish } from '@takram/plateau-type-helpers'

import { TERRAIN_TILE_MODULE_OPTIONS } from './constants'
import { TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'

function readValue(bytes: Uint8ClampedArray, byteOffset: number): number {
  return (
    (bytes[byteOffset] << 16) |
    (bytes[byteOffset + 1] << 8) |
    bytes[byteOffset + 2]
  )
}

function writeValue(
  value: number,
  bytes: Uint8ClampedArray,
  byteOffset: number
): void {
  bytes[byteOffset] = (value >> 16) & 0xff
  bytes[byteOffset + 1] = (value >> 8) & 0xff
  bytes[byteOffset + 2] = value & 0xff
}

// DEM data is encoded as signed integer, but I prefer unsigned value so that it
// can be packed to RGB and linearly interpolated. Handle N/A as zero, as they
// are mostly the sea.
// https://maps.gsi.go.jp/development/demtile.html
function writePackedValue(
  value: number,
  bytes: Uint8ClampedArray,
  byteOffset: number
): void {
  const rgb =
    value > 0x800000
      ? value - 0x800001
      : value !== 0x800000
      ? 0x7ffffe + value
      : 0x7fffff
  writeValue(rgb, bytes, byteOffset)
}

function getParent(coords: Coordinates): Coordinates {
  const divisor = 2 ** coords.level
  const x = coords.x / divisor
  const y = coords.y / divisor
  const level = coords.level - 1
  const scale = 2 ** level
  return {
    x: Math.floor(x * scale),
    y: Math.floor(y * scale),
    level
  }
}

async function getRectangle(coords: Coordinates): Promise<Rectangle> {
  const cesium = await importCesium()
  const tilingScheme = new cesium.WebMercatorTilingScheme()
  return tilingScheme.tileXYToRectangle(coords.x, coords.y, coords.level)
}

async function upscalePackedBytes(
  bytes: Uint8ClampedArray
): Promise<Uint32Array> {
  const packedValues = new Uint32Array(256 * 256)
  for (
    let byteOffset = 0, index = 0;
    byteOffset < bytes.length;
    byteOffset += 3, ++index
  ) {
    packedValues[index] = readValue(bytes, byteOffset)
  }
  return new Uint32Array(
    (
      await sharp(packedValues, {
        raw: {
          width: 256,
          height: 256,
          channels: 1
        }
      })
        .extractChannel(0)
        .resize({
          width: 512,
          height: 512
        })
        .raw({ depth: 'uint' })
        .toBuffer()
    ).buffer
  )
}

function readParentValue(
  parentPackedValues: Uint32Array,
  parentRect: Rectangle,
  rect: Rectangle,
  offset: number
): number {
  invariant(parentPackedValues.length === 512 * 512)
  invariant(offset % 3 === 0 && offset < 256 * 256 * 3)
  const x = (rect.west - parentRect.west) / parentRect.width
  const y = (parentRect.north - rect.north) / parentRect.height
  const index = offset / 3
  const offsetX = (index % 256) / 512
  const offsetY = Math.floor(index / 256) / 512
  const pixelX = Math.floor((x + offsetX) * 512)
  const pixelY = Math.floor((y + offsetY) * 512)
  return parentPackedValues[pixelY * 512 + pixelX]
}

@Injectable()
export class TerrainTileService {
  private readonly logger = new Logger(TerrainTileService.name)
  private readonly byteLength = 256 * 256 * 3

  constructor(
    @Inject(TERRAIN_TILE_MODULE_OPTIONS)
    private readonly options: TerrainTileModuleOptions,
    private readonly cacheService: TileCacheService
  ) {}

  private async requestBuffers({
    x,
    y,
    level
  }: Coordinates): Promise<Buffer[]> {
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
    return (
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
  }

  private async requestTile(coords: Coordinates): Promise<Buffer | undefined> {
    const buffers = await this.requestBuffers(coords)
    if (buffers.length === 0) {
      return
    }

    let parentCache:
      | {
          parentPackedValues: Uint32Array | false
          parentRect: Rectangle
          rect: Rectangle
        }
      | undefined

    const byteArrays = buffers.map(
      buffer => new Uint8ClampedArray(buffer.buffer)
    )
    const result = new Uint8ClampedArray(this.byteLength)
    for (let byteOffset = 0; byteOffset < this.byteLength; byteOffset += 3) {
      let value = 0x800000
      for (const bytes of byteArrays) {
        const nextValue = readValue(bytes, byteOffset)
        if (nextValue !== 0x800000) {
          value = nextValue
          break
        }
      }
      if (value === 0x800000 && coords.level === 15) {
        if (parentCache == null) {
          const parentCoords = getParent(coords)
          const [parentPackedBytes, parentRect, rect] = await Promise.all([
            this.requestTile(parentCoords).then(buffer =>
              buffer != null ? new Uint8ClampedArray(buffer.buffer) : undefined
            ),
            getRectangle(parentCoords),
            getRectangle(coords)
          ])
          parentCache = {
            parentPackedValues:
              parentPackedBytes != null
                ? await upscalePackedBytes(parentPackedBytes)
                : false,
            parentRect,
            rect
          }
        }
        const { parentPackedValues, parentRect, rect } = parentCache
        if (parentPackedValues !== false) {
          const parentValue = readParentValue(
            parentPackedValues,
            parentRect,
            rect,
            byteOffset
          )
          writeValue(parentValue, result, byteOffset)
          continue
        }
      }
      writePackedValue(value, result, byteOffset)
    }
    return Buffer.from(result.buffer)
  }

  async renderTile(
    coords: Coordinates,
    options?: RenderTileOptions
  ): Promise<Readable | string | undefined> {
    if (coords.level > 15) {
      return
    }
    const [cache, discarded] = await Promise.all([
      this.cacheService.findOne(this.options.path, coords),
      this.cacheService.isDiscarded(this.options.path, coords)
    ])
    if (cache != null || discarded) {
      return cache
    }
    const result = await this.requestTile(coords)
    if (result == null) {
      await this.cacheService.discardOne(this.options.path, coords)
      return
    }

    const image = sharp(result, {
      raw: {
        width: 256,
        height: 256,
        channels: 3
      }
    })

    return await this.cacheService.createOne(
      image,
      this.options.path,
      coords,
      options
    )
  }
}
