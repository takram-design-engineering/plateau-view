import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type EstatAreasModuleOptions } from './interfaces/EstatAreasModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<EstatAreasModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
