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
import { Response } from 'express'

import {
  TileFormat,
  TileFormatValidationPipe
} from '@takram/plateau-nest-tile-cache'

import { TERRAIN_TILE_MODULE_OPTIONS } from './constants'
import { type TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'
import { TerrainTileService } from './TerrainTileService'

export function createTerrainTileController(
  options: TerrainTileModuleOptions
): Type {
  @Controller(options.path)
  class TerrainTileController {
    constructor(
      private readonly service: TerrainTileService,
      @Inject(TERRAIN_TILE_MODULE_OPTIONS)
      private readonly options: TerrainTileModuleOptions
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

  return TerrainTileController
}
