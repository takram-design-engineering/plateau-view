import { Module, type DynamicModule } from '@nestjs/common'
import { readFile } from 'fs/promises'

import { CesiumModule } from '@plateau/nest-cesium'

import { VectorTileCoreModule } from './VectorTileCoreModule'
import { VectorTileService } from './VectorTileService'
import { VECTOR_TILE_MAP_STYLE, VECTOR_TILE_OPTIONS } from './constants'
import { createVectorTileController } from './createVectorTileController'
import { type ASYNC_OPTIONS_TYPE } from './moduleDefinitions'
import { type VectorTileModuleOptions } from './interfaces/VectorTileModuleOptions'
import { type VectorTileOptions } from './interfaces/VectorTileOptions'

@Module({})
export class VectorTileModule {
  static forRoot(options: VectorTileModuleOptions): DynamicModule {
    return VectorTileCoreModule.forRoot(options)
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return VectorTileCoreModule.forRootAsync(options)
  }

  static forFeature(options: VectorTileOptions): DynamicModule {
    return {
      module: VectorTileModule,
      imports: [CesiumModule],
      controllers: [createVectorTileController(options)],
      providers: [
        {
          provide: VECTOR_TILE_OPTIONS,
          useValue: options
        },
        {
          provide: VECTOR_TILE_MAP_STYLE,
          useFactory: async () =>
            typeof options.mapStyle === 'string'
              ? JSON.parse(await readFile(options.mapStyle, 'utf-8'))
              : options.mapStyle
        },
        VectorTileService
      ],
      exports: [VectorTileService]
    }
  }
}
