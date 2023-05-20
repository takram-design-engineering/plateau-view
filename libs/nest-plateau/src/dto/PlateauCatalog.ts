import {
  type DocumentData,
  type QueryDocumentSnapshot
} from '@google-cloud/firestore'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { FirestoreCollection } from '@takram/plateau-nest-firestore'

import { type PlateauCatalog0 } from '../schemas/catalog'

export type PlateauCatalogType = PlateauCatalog0['type']

export type PlateauCatalogData<
  T extends PlateauCatalogType = PlateauCatalogType
> = PlateauCatalog0 & { type: T }

@FirestoreCollection('plateau/catalog')
export class PlateauCatalog<T extends PlateauCatalogType = PlateauCatalogType> {
  static fromFirestore(
    snapshot: QueryDocumentSnapshot<PlateauCatalog>
  ): PlateauCatalog {
    return plainToInstance(PlateauCatalog, snapshot.data())
  }

  static toFirestore(model: PlateauCatalog): DocumentData {
    return instanceToPlain(model)
  }

  data!: PlateauCatalogData<`${T}`>
}
