import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  type Type
} from '@nestjs/common'
import { type Response } from 'express'

import {
  TileFormatValidationPipe,
  type TileFormat
} from '@takram/plateau-nest-tile-cache'

import { VECTOR_TILE_MODULE_OPTIONS } from './constants'
import { VectorTileModuleOptions } from './interfaces/VectorTileModuleOptions'
import { type VectorTileOptions } from './interfaces/VectorTileOptions'
import { VectorTileService } from './VectorTileService'

export function createVectorTileController(options: VectorTileOptions): Type {
  @Controller(options.path)
  class VectorTileController {
    constructor(
      private readonly service: VectorTileService,
      @Inject(VECTOR_TILE_MODULE_OPTIONS)
      private readonly options: VectorTileModuleOptions
    ) {}

    @Get(':level/:x/:y.:format')
    async renderTile(
      @Param('x', ParseIntPipe) x: number,
      @Param('y', ParseIntPipe) y: number,
      @Param('level', ParseIntPipe) level: number,
      @Param('format', TileFormatValidationPipe) format: TileFormat,
      @Res({ passthrough: true }) res: Response
    ): Promise<StreamableFile | undefined> {
      const result = await this.service.renderTile({ x, y, level }, { format })
      if (result == null) {
        return
      }
      if (typeof result === 'string') {
        res.redirect(result)
        return
      }
      res.set({
        'Content-Type': `image/${format}`
      })
      if (this.options.disableCache !== true) {
        res.set({
          'Cache-Control': 'public, max-age=31536000' // 1 year
        })
      }
      return new StreamableFile(result)
    }
  }

  return VectorTileController
}
