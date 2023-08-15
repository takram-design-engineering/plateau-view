import { readFile } from 'fs/promises'
import path from 'path'
import { Storage } from '@google-cloud/storage'
import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@takram/plateau-nest-firestore'

import { PLATEAU_MODULE_OPTIONS, PLATEAU_STORAGE_FILES } from './constants'
import { PlateauCatalog } from './dto/PlateauCatalog'
import { PlateauMunicipality } from './dto/PlateauMunicipality'
import { type PlateauModuleOptions } from './interfaces/PlateauModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'
import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauMunicipalityService } from './PlateauMunicipalityService'
import { PlateauPrefectureService } from './PlateauPrefectureService'
import {
  PlateauStorageService,
  type PlateauStorageFiles
} from './PlateauStorageService'
import { PlateauAreaFieldResolver } from './resolvers/PlateauAreaFieldResolver'
import { PlateauDatasetFieldResolver } from './resolvers/PlateauDatasetFieldResolver'
import { PlateauDatasetResolver } from './resolvers/PlateauDatasetResolver'
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
        if (options.storageRoot.startsWith('gs://')) {
          const url = new URL(options.storageRoot)
          const storage = new Storage()
          const bucket = storage.bucket(url.host)
          const [buffer] = await bucket
            .file(`${url.pathname.slice(1)}/plateau.json`)
            .download()
          return JSON.parse(buffer.toString('utf-8'))
        } else {
          return JSON.parse(
            await readFile(
              path.join(options.storageRoot, 'plateau.json'),
              'utf-8'
            )
          )
        }
      },
      inject: [MODULE_OPTIONS_TOKEN]
    },
    PlateauCatalogService,
    PlateauStorageService,
    PlateauPrefectureService,
    PlateauMunicipalityService,
    PlateauAreaFieldResolver,
    PlateauDatasetFieldResolver,
    PlateauMunicipalityResolver,
    PlateauMunicipalityFieldResolver,
    PlateauPrefectureResolver,
    PlateauPrefectureFieldResolver,
    PlateauDatasetResolver
  ],
  exports: [PlateauCatalogService]
})
export class PlateauModule extends ConfigurableModuleClass {}
