import { Global, Module } from '@nestjs/common'

import { CESIUM } from './constants'
import { importCesium } from './helpers'

@Global()
@Module({
  providers: [
    {
      provide: CESIUM,
      useFactory: async () => await importCesium()
    }
  ],
  exports: [CESIUM]
})
export class CesiumModule {}
