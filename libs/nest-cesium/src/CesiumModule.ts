import { Global, Module } from '@nestjs/common'

import { type Cesium } from './Cesium'
import { CESIUM } from './constants'
import { importESM } from './helpers'

@Global()
@Module({
  providers: [
    {
      provide: CESIUM,
      useFactory: async () => await importESM<Cesium>('@cesium/engine')
    }
  ],
  exports: [CESIUM]
})
export class CesiumModule {}
