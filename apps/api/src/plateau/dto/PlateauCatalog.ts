import {
  type DocumentData,
  type QueryDocumentSnapshot
} from '@google-cloud/firestore'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { Collection } from '@plateau/nest-firestore'

import { type PlateauCatalog0 } from '../schemas/catalog'

@Collection('plateau/catalog')
export class PlateauCatalog {
  static fromFirestore(
    snapshot: QueryDocumentSnapshot<PlateauCatalog0>
  ): PlateauCatalog {
    return plainToInstance(PlateauCatalog, snapshot.data())
  }

  static toFirestore(data: PlateauCatalog0): DocumentData {
    return instanceToPlain(data)
  }
}
