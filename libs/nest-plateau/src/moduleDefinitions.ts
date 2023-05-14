import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type PlateauModuleOptions } from './interfaces/PlateauModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<PlateauModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
