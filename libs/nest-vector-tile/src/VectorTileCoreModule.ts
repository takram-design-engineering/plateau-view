import { Global, Module } from '@nestjs/common'

import { VECTOR_TILE_MODULE_OPTIONS } from './constants'
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
    }
  ],
  exports: [VECTOR_TILE_MODULE_OPTIONS]
})
export class VectorTileCoreModule extends ConfigurableModuleClass {}
