import {
  type DocumentData,
  type QueryDocumentSnapshot
} from '@google-cloud/firestore'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { Collection } from '@plateau/nest-firestore'

import { type PlateauCatalog0 } from '../schemas/catalog'

@Collection('plateau/datasets')
@ObjectType()
export class PlateauDataset {
  static fromFirestore(
    snapshot: QueryDocumentSnapshot<PlateauCatalog0>
  ): PlateauDataset {
    return plainToInstance(PlateauDataset, {
      data: snapshot.data()
    })
  }

  static toFirestore(data: PlateauCatalog0): DocumentData {
    return instanceToPlain(data)
  }

  @Field(() => ID)
  get id(): string {
    return this.data.id
  }

  @Field()
  get name(): string {
    return this.data.name
  }

  private readonly data!: PlateauCatalog0
}
