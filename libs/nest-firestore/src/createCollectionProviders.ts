import {
  type Firestore,
  type FirestoreDataConverter
} from '@google-cloud/firestore'
import { type Provider, type Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import path from 'path'

import {
  FIRESTORE_COLLECTION,
  FIRESTORE_COLLECTION_METADATA,
  FIRESTORE_MODULE_OPTIONS
} from './constants'
import { type FirestoreModuleOptions } from './interfaces/FirestoreModuleOptions'

function hasConverter<T>(
  value: Type<T>
): value is Type<T> & FirestoreDataConverter<T> {
  return (
    'toFirestore' in value &&
    typeof value.toFirestore === 'function' &&
    'fromFirestore' in value &&
    typeof value.fromFirestore === 'function'
  )
}

export function createCollectionProviders(
  collections: readonly Type[]
): Provider[] {
  return collections.map(collection => ({
    provide: collection,
    useFactory: (
      reflector: Reflector,
      firestore: Firestore,
      { rootPath }: FirestoreModuleOptions
    ) => {
      const collectionPath = reflector.get(
        FIRESTORE_COLLECTION_METADATA,
        collection
      )
      const ref = firestore.collection(
        path.join(rootPath ?? '', collectionPath)
      )
      return hasConverter(collection) ? ref.withConverter(collection) : ref
    },
    inject: [Reflector, FIRESTORE_COLLECTION, FIRESTORE_MODULE_OPTIONS]
  }))
}
