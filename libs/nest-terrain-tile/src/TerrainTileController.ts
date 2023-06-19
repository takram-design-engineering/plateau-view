import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  type Type
} from '@nestjs/common'
import { Response } from 'express'

import {
  TileFormat,
  TileFormatValidationPipe
} from '@takram/plateau-nest-tile-cache'

import { type TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'
import { TerrainTileService } from './TerrainTileService'

export function createTerrainTileController(
  options: TerrainTileModuleOptions
): Type {
  @Controller(options.path)
  class TerrainTileController {
    constructor(private readonly service: TerrainTileService) {}

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

  return TerrainTileController
}
