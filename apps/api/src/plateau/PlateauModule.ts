import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauDatasetsResolver } from './PlateauDatasetsResolver'
import { PlateauCatalogDataset } from './dto/PlateauCatalogDataset'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauCatalogDataset])],
  providers: [PlateauCatalogService, PlateauDatasetsResolver],
  exports: [PlateauCatalogService]
})
export class PlateauModule {}
