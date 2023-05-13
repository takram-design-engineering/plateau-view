import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauDataset } from './dto/PlateauDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { PlateauDatasetsResolver } from './resolvers/PlateauDatasetsResolver'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauDataset, PlateauMunicipality])],
  providers: [PlateauCatalogService, PlateauDatasetsResolver],
  exports: [PlateauCatalogService]
})
export class PlateauModule {}
