import {
  Controller,
  Get,
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

import { VectorTileService } from './VectorTileService'
import { type VectorTileOptions } from './interfaces/VectorTileOptions'

export function createVectorTileController(options: VectorTileOptions): Type {
  @Controller(options.path)
  class VectorTileController {
    constructor(private readonly service: VectorTileService) {}

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
        'Content-Type': `image/${format}`,
        'Cache-Control': 'public, max-age=31536000' // 1 year
      })
      return new StreamableFile(result)
    }
  }

  return VectorTileController
}
