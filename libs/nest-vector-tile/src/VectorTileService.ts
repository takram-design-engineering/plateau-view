import { Map, MapOptions } from '@maplibre/maplibre-gl-native'
import { Inject, Injectable } from '@nestjs/common'
import sharp, { type Sharp } from 'sharp'
import { type Readable } from 'stream'
import invariant from 'tiny-invariant'

import { CESIUM, type Cesium } from '@plateau/nest-cesium'

import {
  VECTOR_TILE_CACHE,
  VECTOR_TILE_MAP_OPTIONS,
  VECTOR_TILE_MAP_STYLE,
  VECTOR_TILE_OPTIONS
} from './constants'
import { type Coordinates } from './interfaces/Coordinates'
import { type VectorTileCache } from './interfaces/VectorTileCache'
import { type VectorTileRenderFormat } from './interfaces/VectorTileFormat'
import { VectorTileOptions } from './interfaces/VectorTileOptions'

interface RenderOptions {
  zoom: number
  width?: number
  height?: number
  center?: [number, number]
  bearing?: number
  pitch?: number
  classes?: string[]
}

interface MapStyle {
  layers: Array<{
    id: string
  }>
}

interface RenderTileOptions {
  format?: VectorTileRenderFormat
}

function applyFormat(image: Sharp, format: VectorTileRenderFormat): Sharp {
  return format === 'webp' ? image.webp({ lossless: true }) : image.png()
}

@Injectable()
export class VectorTileService {
  constructor(
    @Inject(VECTOR_TILE_CACHE)
    private readonly cache: VectorTileCache | undefined,
    @Inject(VECTOR_TILE_OPTIONS)
    private readonly options: VectorTileOptions,
    @Inject(VECTOR_TILE_MAP_OPTIONS)
    private readonly mapOptions: MapOptions,
    @Inject(VECTOR_TILE_MAP_STYLE)
    private readonly mapStyle: MapStyle,
    @Inject(CESIUM)
    private readonly cesium: Cesium
  ) {}

  private async render(options: RenderOptions): Promise<Uint8Array> {
    const map = new Map(this.mapOptions)
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
