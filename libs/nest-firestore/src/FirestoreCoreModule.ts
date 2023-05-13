import { Firestore, type Settings } from '@google-cloud/firestore'
import { Global, Module } from '@nestjs/common'

import { FIRESTORE, FIRESTORE_MODULE_OPTIONS } from './constants'
import { type FirestoreModuleOptions } from './interfaces/FirestoreModuleOptions'
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN
} from './moduleDefinitions'

@Global()
@Module({
  providers: [
    {
      provide: FIRESTORE_MODULE_OPTIONS,
      useFactory: (options: FirestoreModuleOptions) => options,
      inject: [MODULE_OPTIONS_TOKEN]
    },
    {
      provide: FIRESTORE,
      useFactory: (options: Settings) => new Firestore(options),
      inject: [FIRESTORE_MODULE_OPTIONS, FIRESTORE]
    }
  ]
})
export class FirestoreCoreModule extends ConfigurableModuleClass {}
