import { Global, Module } from '@nestjs/common'

import { BucketCache } from './BucketCache'
import { FileCache } from './FileCache'
import { TileCacheService } from './TileCacheService'
import { TILE_CACHE, TILE_CACHE_MODULE_OPTIONS } from './constants'
import { type TileCacheModuleOptions } from './interfaces/TileCacheModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'

@Global()
@Module({
  providers: [
    {
      provide: TILE_CACHE_MODULE_OPTIONS,
      useFactory: (options: TileCacheModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: TILE_CACHE,
      useFactory: ({ disabled = false, cacheRoot }: TileCacheModuleOptions) => {
        if (disabled || cacheRoot == null) {
          return undefined
        }
        return cacheRoot.startsWith('gs://')
          ? new BucketCache(cacheRoot)
          : new FileCache(cacheRoot)
      },
      inject: [MODULE_OPTIONS_TOKEN]
    },
    TileCacheService
  ],
  exports: [TILE_CACHE_MODULE_OPTIONS, TileCacheService]
})
export class TileCacheModule extends ConfigurableModuleClass {}
