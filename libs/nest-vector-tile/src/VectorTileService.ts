import {
  Map,
  type MapOptions,
  type ResourceKind
} from '@maplibre/maplibre-gl-native'
import { Inject, Injectable } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'
import { type CustomLayerInterface, type Style } from 'mapbox-gl'
import sharp, { type Sharp } from 'sharp'

import { CESIUM, type Cesium } from '@takram/plateau-nest-cesium'
import {
  CachedTileRenderer,
  type Coordinates,
  type TileCache
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

@Injectable()
export class VectorTileService extends CachedTileRenderer {
  constructor(
    @Inject(VECTOR_TILE_CACHE)
    cache: TileCache | undefined,
    @Inject(VECTOR_TILE_OPTIONS)
    private readonly options: VectorTileOptions,
    @Inject(VECTOR_TILE_MAP_STYLE)
    private readonly mapStyle: MapStyle,
    @Inject(CESIUM)
    private readonly cesium: Cesium
  ) {
    super({
      cache,
      path: options.path,
      maximumLevel: options.maximumLevel
    })
  }

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

  private async renderMap(options: RenderOptions): Promise<Uint8Array> {
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

  override async renderTile({ x, y, level }: Coordinates): Promise<Sharp> {
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

    const buffer = await this.renderMap({
      zoom: level,
      center: [
        toDegrees((rectangle.east + rectangle.west) / 2),
        toDegrees(latitude)
      ]
    })
    const tileSize = this.options.tileSize ?? 512
    return sharp(buffer, {
      raw: {
        width: tileSize,
        height: tileSize,
        channels: 4
      }
    })
  }
}
