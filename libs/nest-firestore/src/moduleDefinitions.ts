import { ConfigurableModuleBuilder } from '@nestjs/common'

import { type FirestoreModuleOptions } from './interfaces/FirestoreModuleOptions'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<FirestoreModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
