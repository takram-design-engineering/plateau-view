import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type TerrainTileModuleOptions } from './interfaces/TerrainTileModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<TerrainTileModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
