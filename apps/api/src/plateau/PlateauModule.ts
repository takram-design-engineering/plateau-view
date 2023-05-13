import { Global, Module } from '@nestjs/common'

import { PlateauCatalogService } from './PlateauCatalogService'

@Global()
@Module({
  providers: [PlateauCatalogService],
  exports: [PlateauCatalogService]
})
export class PlateauModule {}
