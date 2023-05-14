import {
  type DocumentData,
  type QueryDocumentSnapshot
} from '@google-cloud/firestore'
import { Field, ObjectType } from '@nestjs/graphql'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { IsNumberString, IsString } from 'class-validator'

import { FirestoreCollection } from '@plateau/nest-firestore'

import { validateSyncOrThrow } from '../helpers/validateSyncOrThrow'
import { PlateauArea } from './PlateauArea'
import { PlateauAreaType, PlateauAreaTypeEnum } from './PlateauAreaType'

@FirestoreCollection('plateau/municipalities')
@ObjectType({
  implements: [PlateauArea]
})
export class PlateauMunicipality extends PlateauArea {
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

  @Field(() => PlateauAreaTypeEnum)
  type: PlateauAreaType = 'municipality'

  @Field()
  @IsNumberString()
  code!: string

  @Field()
  @IsString()
  name!: string

  parents!: InstanceType<typeof PlateauArea>['parents']
}
