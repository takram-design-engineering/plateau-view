import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauMunicipalityService } from './PlateauMunicipalityService'
import { PlateauDataset } from './dto/PlateauDataset'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { PlateauAreaFieldResolver } from './resolvers/PlateauAreaFieldResolver'
import { PlateauDatasetResolver } from './resolvers/PlateauDatasetResolver'
import { PlateauMunicipalityFieldResolver } from './resolvers/PlateauMunicipalityFieldResolver'
import { PlateauMunicipalityResolver } from './resolvers/PlateauMunicipalityResolver'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauDataset, PlateauMunicipality])],
  providers: [
    PlateauCatalogService,
    PlateauMunicipalityService,
    PlateauDatasetResolver,
    PlateauAreaFieldResolver,
    PlateauMunicipalityResolver,
    PlateauMunicipalityFieldResolver
  ],
  exports: [PlateauCatalogService]
})
export class PlateauModule {}
