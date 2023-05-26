import { Global, Module } from '@nestjs/common'

import { BucketCache } from './caches/BucketCache'
import { FileCache } from './caches/FileCache'
import { VECTOR_TILE_CACHE, VECTOR_TILE_MODULE_OPTIONS } from './constants'
import { type VectorTileModuleOptions } from './interfaces/VectorTileModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'

@Global()
@Module({
  providers: [
    {
      provide: VECTOR_TILE_MODULE_OPTIONS,
      useFactory: (options: VectorTileModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: VECTOR_TILE_CACHE,
      useFactory: ({ useCache = true, cacheRoot }: VectorTileModuleOptions) => {
        if (!useCache || cacheRoot == null) {
          return undefined
        }
        return cacheRoot.startsWith('gs://')
          ? new BucketCache(cacheRoot)
          : new FileCache(cacheRoot)
      },
      inject: [MODULE_OPTIONS_TOKEN]
    }
  ],
  exports: [VECTOR_TILE_MODULE_OPTIONS, VECTOR_TILE_CACHE]
})
export class VectorTileCoreModule extends ConfigurableModuleClass {}
