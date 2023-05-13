import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauDatasetsService } from './PlateauDatasetsService'
import { PlateauDatasetsResolver } from './resolvers/PlateauDatasetsResolver'
import { PlateauDataset } from './dto/PlateauDataset'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauDataset])],
  providers: [PlateauDatasetsService, PlateauDatasetsResolver],
  exports: [PlateauDatasetsService]
})
export class PlateauModule {}
