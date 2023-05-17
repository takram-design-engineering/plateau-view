import { Storage } from '@google-cloud/storage'
import { Global, Module } from '@nestjs/common'
import { readFile } from 'fs/promises'
import path from 'path'

import { FirestoreModule } from '@plateau/nest-firestore'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauMunicipalityService } from './PlateauMunicipalityService'
import {
  PlateauStorageService,
  type PlateauStorageFiles
} from './PlateauStorageService'
import { PLATEAU_STORAGE_FILES, PLATEAU_MODULE_OPTIONS } from './constants'
import { PlateauCatalog } from './dto/PlateauCatalog'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { type PlateauModuleOptions } from './interfaces/PlateauModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'
import { PlateauAreaFieldResolver } from './resolvers/PlateauAreaFieldResolver'
import { PlateauDatasetFieldResolver } from './resolvers/PlateauDatasetFieldResolver'
import { PlateauMunicipalityFieldResolver } from './resolvers/PlateauMunicipalityFieldResolver'
import { PlateauMunicipalityResolver } from './resolvers/PlateauMunicipalityResolver'
import { PlateauPrefectureFieldResolver } from './resolvers/PlateauPrefectureFieldResolver'
import { PlateauPrefectureResolver } from './resolvers/PlateauPrefectureResolver'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([PlateauCatalog, PlateauMunicipality])],
  providers: [
    {
      provide: PLATEAU_MODULE_OPTIONS,
      useFactory: (options: PlateauModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: PLATEAU_STORAGE_FILES,
      useFactory: async (
        options: PlateauModuleOptions
      ): Promise<PlateauStorageFiles> => {
        if (options.dataRoot.startsWith('gs://')) {
          const url = new URL(options.dataRoot)
          const storage = new Storage()
          const bucket = storage.bucket(url.host)
          const [buffer] = await bucket
            .file(`${url.pathname.slice(1)}/plateau.json`)
            .download()
          return JSON.parse(buffer.toString('utf-8'))
        } else {
          return JSON.parse(
            await readFile(path.join(options.dataRoot, 'plateau.json'), 'utf-8')
          )
        }
      },
      inject: [MODULE_OPTIONS_TOKEN]
    },
    PlateauCatalogService,
    PlateauStorageService,
    PlateauMunicipalityService,
    PlateauAreaFieldResolver,
    PlateauDatasetFieldResolver,
    PlateauMunicipalityResolver,
    PlateauMunicipalityFieldResolver,
    PlateauPrefectureResolver,
    PlateauPrefectureFieldResolver
  ],
  exports: [PlateauCatalogService]
})
export class PlateauModule extends ConfigurableModuleClass {}
