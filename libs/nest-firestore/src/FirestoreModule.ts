import { Module, type DynamicModule, type Type } from '@nestjs/common'

import { FirestoreCoreModule } from './FirestoreCoreModule'
import { createCollectionProviders } from './createCollectionProviders'
import { type FirestoreModuleOptions } from './interfaces/FirestoreModuleOptions'
import { type ASYNC_OPTIONS_TYPE } from './moduleDefinitions'

@Module({})
export class FirestoreModule {
  static forRoot(options?: FirestoreModuleOptions): DynamicModule {
    return FirestoreCoreModule.forRoot(options ?? {})
  }

  static forRootAsync(options?: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return FirestoreCoreModule.forRootAsync(options ?? {})
  }

  static forFeatures(collections: readonly Type[]): DynamicModule {
    const collectionProviders = createCollectionProviders(collections)
    return {
      module: FirestoreModule,
      providers: collectionProviders,
      exports: collectionProviders
    }
  }
}
