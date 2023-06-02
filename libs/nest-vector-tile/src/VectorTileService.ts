import {
  Map,
  type MapOptions,
  type ResourceKind
} from '@maplibre/maplibre-gl-native'
import { Inject, Injectable } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'
import { type CustomLayerInterface, type Style } from 'mapbox-gl'
import sharp from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { CESIUM, type Cesium } from '@takram/plateau-nest-cesium'
import {
  TileCacheService,
  type Coordinates,
  type RenderTileOptions
} from '@takram/plateau-nest-tile-cache'

import { VECTOR_TILE_MAP_STYLE, VECTOR_TILE_OPTIONS } from './constants'
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

@Injectable()
export class VectorTileService {
  constructor(
    @Inject(VECTOR_TILE_OPTIONS)
    private readonly options: VectorTileOptions,
    private readonly cacheService: TileCacheService,
    @Inject(VECTOR_TILE_MAP_STYLE)
    private readonly mapStyle: MapStyle,
    @Inject(CESIUM)
    private readonly cesium: Cesium
  ) {}

  private requestTile(
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
          if (req.kind === 3 /* ResourceKind.Tile */) {
            const [level, x, y] = new URL(req.url).pathname
              .split('/')
              .slice(-3)
              .map(value => +value.split('.')[0])
            invariant(!isNaN(level) && !isNaN(x) && !isNaN(y))
            const coords = { x, y, level }
            await this.cacheService.discardOne(this.options.path, coords)
          }
          callback()
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

  private async renderMap(options: RenderOptions): Promise<Uint8Array> {
    const map = new Map({
      request: this.requestTile.bind(this)
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
        map.release()
        if (error != null) {
          reject(error)
        } else {
          resolve(buffer)
        }
      })
    })
  }

  async renderTile(
    coords: Coordinates,
    options?: RenderTileOptions
  ): Promise<Readable | string | undefined> {
    if (coords.level > this.options.maximumLevel) {
      return
    }
    const [cache, discarded] = await Promise.all([
      this.cacheService.findOne(this.options.path, coords),
      this.cacheService.isDiscarded(this.options.path, coords)
    ])
    if (cache != null || discarded) {
      return cache
    }

    const {
      Cartesian3,
      Cartographic,
      Math: { toDegrees },
      WebMercatorTilingScheme
    } = this.cesium

    const { x, y, level } = coords
    const tilingScheme = new WebMercatorTilingScheme()
    const rectangle = tilingScheme.tileXYToRectangle(x, y, level)
    const projection = tilingScheme.projection
    const y1 = projection.project(new Cartographic(0, rectangle.north)).y
    const y2 = projection.project(new Cartographic(0, rectangle.south)).y
    const { latitude } = projection.unproject(new Cartesian3(0, (y1 + y2) / 2))

    const buffer = await this.renderMap({
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

    return await this.cacheService.createOne(
      image,
      this.options.path,
      coords,
      options
    )
  }
}
