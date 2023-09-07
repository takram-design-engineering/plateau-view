import { Global, Module } from '@nestjs/common'

import { FirestoreModule } from '@takram/plateau-nest-firestore'

import { ESTAT_AREAS_MODULE_OPTIONS } from './constants'
import { EstatAreaDocument } from './dto/EstatAreaDocument'
import { EstatAreasService } from './EstatAreasService'
import { type EstatAreasModuleOptions } from './interfaces/EstatAreasModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'
import { EstatAreaResolver } from './resolvers/EstatAreaResolver'

@Global()
@Module({
  imports: [FirestoreModule.forFeatures([EstatAreaDocument])],
  providers: [
    {
      provide: ESTAT_AREAS_MODULE_OPTIONS,
      useFactory: (options: EstatAreasModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    EstatAreasService,
    EstatAreaResolver
  ],
  exports: [EstatAreasService]
})
export class EstatAreasModule extends ConfigurableModuleClass {}
