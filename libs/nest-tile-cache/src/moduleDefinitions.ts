import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type TileCacheModuleOptions } from './interfaces/TileCacheModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<TileCacheModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
