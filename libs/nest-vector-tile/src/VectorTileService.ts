import {
  Map,
  type MapOptions,
  type ResourceKind
} from '@maplibre/maplibre-gl-native'
import { Inject, Injectable } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'
import { type CustomLayerInterface, type Style } from 'mapbox-gl'
import sharp, { type Sharp } from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { CESIUM, type Cesium } from '@takram/plateau-nest-cesium'
import {
  type Coordinates,
  type TileCache,
  type TileFormat
} from '@takram/plateau-nest-tile-cache'

import {
  VECTOR_TILE_CACHE,
  VECTOR_TILE_MAP_STYLE,
  VECTOR_TILE_OPTIONS
} from './constants'
import { VectorTileOptions } from './interfaces/VectorTileOptions'

interface MapRequest {
  url: string
  kind: ResourceKind
}

interface RenderOptions {
  zoom: number
  width?: number
  height?: number
  center?: [number, number]
  bearing?: number
  pitch?: number
  classes?: string[]
}

type MapStyle = Omit<Style, 'layers'> & {
  layers: Array<Exclude<Style['layers'][number], CustomLayerInterface>>
}

interface RenderTileOptions {
  format?: TileFormat
}

function applyFormat(image: Sharp, format: TileFormat): Sharp {
  return format === 'webp' ? image.webp({ lossless: true }) : image.png()
}

@Injectable()
export class VectorTileService {
  constructor(
    @Inject(VECTOR_TILE_CACHE)
    private readonly cache: TileCache | undefined,
    @Inject(VECTOR_TILE_OPTIONS)
    private readonly options: VectorTileOptions,
    @Inject(VECTOR_TILE_MAP_STYLE)
    private readonly mapStyle: MapStyle,
    @Inject(CESIUM)
    private readonly cesium: Cesium
  ) {}

  private request(
    req: MapRequest,
    callback: Parameters<MapOptions['request']>[1]
  ): void {
    ;(async () => {
      try {
        const { data: arrayBuffer } = await axios<ArrayBuffer>(req.url, {
          responseType: 'arraybuffer'
        })
        callback(undefined, {
          data: Buffer.from(arrayBuffer)
        })
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          callback(undefined, {
            data: Buffer.alloc(0)
          })
        } else if (error instanceof Error) {
          callback(error)
        } else {
          callback(new Error('Unknown error'))
        }
      }
    })().catch(error => {
      callback(error)
    })
  }

  private async render(options: RenderOptions): Promise<Uint8Array> {
    const map = new Map({
      request: this.request.bind(this)
    })
    map.load(this.mapStyle)

    // Render upto the maximum level using the native maximum level as data.
    // TODO: Reduce visible layers
    if (options.zoom > this.options.nativeMaximumLevel) {
      this.mapStyle.layers.forEach(({ id }) => {
        map.setLayerZoomRange(id, 0, this.options.maximumLevel)
      })
    }

    return await new Promise<Uint8Array>((resolve, reject) => {
      map.render(options, (error, buffer) => {
        if (error != null) {
          reject(error)
        } else {
          map.release()
          resolve(buffer)
        }
      })
    })
  }

  async renderTile(
    coords: Coordinates,
    { format = 'png' }: RenderTileOptions = {}
  ): Promise<Sharp | Readable | string | undefined> {
    const { x, y, level } = coords
    if (level > this.options.maximumLevel) {
      return
    }

    if (this.cache != null) {
      const cache = await this.cache.get(this.options.path, coords, format)
      if (cache != null) {
        return cache
      }
    }

    const {
      Cartesian3,
      Cartographic,
      Math: { toDegrees },
      WebMercatorTilingScheme
    } = this.cesium

    const tilingScheme = new WebMercatorTilingScheme()
    const rectangle = tilingScheme.tileXYToRectangle(x, y, level)
    const projection = tilingScheme.projection
    const y1 = projection.project(new Cartographic(0, rectangle.north)).y
    const y2 = projection.project(new Cartographic(0, rectangle.south)).y
    const { latitude } = projection.unproject(new Cartesian3(0, (y1 + y2) / 2))

    const buffer = await this.render({
      zoom: level,
      center: [
        toDegrees((rectangle.east + rectangle.west) / 2),
        toDegrees(latitude)
      ]
    })
    const tileSize = this.options.tileSize ?? 512
    const image = sharp(buffer, {
      raw: {
        width: tileSize,
        height: tileSize,
        channels: 4
      }
    })

    if (this.cache != null) {
      ;(async () => {
        invariant(this.cache != null)
        await this.cache.set(
          this.options.path,
          coords,
          format,
          applyFormat(
            sharp(buffer, {
              raw: {
                width: tileSize,
                height: tileSize,
                channels: 4
              }
            }),
            format
          )
        )
      })().catch(error => {
        console.error(error)
      })
    }

    return applyFormat(image, format)
  }
}
