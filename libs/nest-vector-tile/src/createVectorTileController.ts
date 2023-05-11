import {
  BadRequestException,
  Controller,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Res,
  StreamableFile,
  type ArgumentMetadata,
  type PipeTransform,
  type Type
} from '@nestjs/common'
import { type Response } from 'express'

import { VectorTileService } from './VectorTileService'
import { VectorTileRenderFormat } from './interfaces/VectorTileFormat'
import { type VectorTileOptions } from './interfaces/VectorTileOptions'

@Injectable()
class FormatValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): string {
    if (value !== 'png' && value !== 'webp') {
      throw new BadRequestException('Invalid format')
    }
    return value
  }
}

export function createVectorTileController(options: VectorTileOptions): Type {
  @Controller(options.path)
  class VectorTileController {
    constructor(private readonly service: VectorTileService) {}

    @Get(':level/:x/:y.:format')
    async renderTilePng(
      @Param('x', ParseIntPipe) x: number,
      @Param('y', ParseIntPipe) y: number,
      @Param('level', ParseIntPipe) level: number,
      @Param('format', FormatValidationPipe) format: VectorTileRenderFormat,
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
      return new StreamableFile(result)
    }
  }

  return VectorTileController
}
