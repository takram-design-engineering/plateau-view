import { type Readable } from 'stream'
import {
  Map,
  type MapOptions,
  type ResourceKind
} from '@maplibre/maplibre-gl-native'
import { Inject, Injectable } from '@nestjs/common'
import axios from 'axios'
import { createPool, type Pool } from 'generic-pool'
import { type CustomLayerInterface, type Style } from 'mapbox-gl'
import sharp from 'sharp'

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

function requestTile(
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
      if (error instanceof Error) {
        callback(error)
      } else {
        callback(new Error('Unknown error'))
      }
    }
  })().catch(error => {
    callback(error)
  })
}

@Injectable()
export class VectorTileService {
  mapPool: Pool<Map>

  constructor(
    @Inject(VECTOR_TILE_OPTIONS)
    private readonly options: VectorTileOptions,
    private readonly cacheService: TileCacheService,
    @Inject(VECTOR_TILE_MAP_STYLE)
    private readonly mapStyle: MapStyle,
    @Inject(CESIUM)
    private readonly cesium: Cesium
  ) {
    this.mapPool = createPool(
      {
        create: async () => {
          const map = new Map({ request: requestTile })
          map.load(this.mapStyle)
          return map
        },
        destroy: async map => {
          map.release()
        }
      },
      { max: 32 }
    )
  }

  private async renderMap(options: RenderOptions): Promise<Uint8Array> {
    const map = await this.mapPool.acquire()
    // eslint-disable-next-line @typescript-eslint/return-await
    return new Promise<Uint8Array>((resolve, reject) => {
      map.render(options, (error, buffer) => {
        void this.mapPool.release(map)
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
    if (
      coords.level < this.options.minimumDataLevel ||
      coords.level > this.options.maximumLevel
    ) {
      return
    }
    const cache = await this.cacheService.findOne(this.options.path, coords)
    if (cache != null) {
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
