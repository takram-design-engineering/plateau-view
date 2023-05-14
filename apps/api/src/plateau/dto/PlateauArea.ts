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

  // In descending order. The root area comes last.
  abstract parents: Array<{
    type: PlateauAreaType
    code: string
  }>
}
