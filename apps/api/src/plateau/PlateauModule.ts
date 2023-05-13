import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauMunicipalityService } from './PlateauMunicipalityService'
import { PlateauCatalog } from './dto/PlateauCatalog'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { PlateauAreaFieldResolver } from './resolvers/PlateauAreaFieldResolver'
import { PlateauDatasetFieldResolver } from './resolvers/PlateauDatasetFieldResolver'
import { PlateauDatasetResolver } from './resolvers/PlateauDatasetResolver'
import { PlateauMunicipalityFieldResolver } from './resolvers/PlateauMunicipalityFieldResolver'
import { PlateauMunicipalityResolver } from './resolvers/PlateauMunicipalityResolver'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauCatalog, PlateauMunicipality])],
  providers: [
    PlateauCatalogService,
    PlateauMunicipalityService,
    PlateauAreaFieldResolver,
    PlateauDatasetResolver,
    PlateauDatasetFieldResolver,
    PlateauMunicipalityResolver,
    PlateauMunicipalityFieldResolver
  ],
  exports: [PlateauCatalogService]
})
export class PlateauModule {}
