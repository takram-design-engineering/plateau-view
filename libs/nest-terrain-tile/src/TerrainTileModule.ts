import { Global, Module, type DynamicModule } from '@nestjs/common'

import { BucketCache, FileCache } from '@takram/plateau-nest-tile-cache'

import { createTerrainTileController } from './TerrainTileController'
import { TerrainTileService } from './TerrainTileService'
import { TERRAIN_TILE_CACHE, TERRAIN_TILE_MODULE_OPTIONS } from './constants'
import { type TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'

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
        {
          provide: TERRAIN_TILE_CACHE,
          useFactory: () => {
            const { useCache, cacheRoot } = options
            if (useCache === false || cacheRoot == null) {
              return undefined
            }
            return cacheRoot.startsWith('gs://')
              ? new BucketCache(cacheRoot)
              : new FileCache(cacheRoot)
          }
        },
        TerrainTileService
      ],
      controllers: [createTerrainTileController(options)]
    }
  }
}
