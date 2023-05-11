import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type VectorTileModuleOptions } from './interfaces/VectorTileModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<VectorTileModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
