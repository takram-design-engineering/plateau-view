import { Field, InterfaceType } from '@nestjs/graphql'

import { PlateauAreaType, PlateauAreaTypeEnum } from './PlateauAreaType'

@InterfaceType()
export abstract class PlateauArea {
  @Field(() => PlateauAreaTypeEnum)
  abstract type: PlateauAreaType

  @Field()
  abstract code: string

  @Field()
  abstract name: string

  abstract parentCode: string | null
}
