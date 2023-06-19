import { Global, Module, type DynamicModule } from '@nestjs/common'

import { TERRAIN_TILE_MODULE_OPTIONS } from './constants'
import { type TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'
import { createTerrainTileController } from './TerrainTileController'
import { TerrainTileService } from './TerrainTileService'

@Global()
@Module({})
export class TerrainTileModule {
  static forRoot(options: TerrainTileModuleOptions): DynamicModule {
    return {
      module: TerrainTileModule,
      providers: [
        {
          provide: TERRAIN_TILE_MODULE_OPTIONS,
          useValue: options
        },
        TerrainTileService
      ],
      controllers: [createTerrainTileController(options)]
    }
  }
}
