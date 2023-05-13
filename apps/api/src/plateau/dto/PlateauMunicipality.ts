import {
  type DocumentData,
  type QueryDocumentSnapshot
} from '@google-cloud/firestore'
import { Field, ObjectType } from '@nestjs/graphql'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { Collection } from '@plateau/nest-firestore'

import { validateSyncOrThrow } from '../../helpers/validateSyncOrThrow'

@Collection('plateau/municipalities')
@ObjectType()
export class PlateauMunicipality {
  static fromFirestore(
    snapshot: QueryDocumentSnapshot<PlateauMunicipality>
  ): PlateauMunicipality {
    return validateSyncOrThrow(
      plainToInstance(PlateauMunicipality, snapshot.data())
    )
  }

  static toFirestore(model: PlateauMunicipality): DocumentData {
    return instanceToPlain(model)
  }

  @Field()
  code!: string

  @Field()
  name!: string

  parentCode!: string
  prefectureCode!: string
}
