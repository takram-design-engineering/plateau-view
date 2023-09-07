import { Field, ObjectType } from '@nestjs/graphql'
import { BBox } from 'geojson'
import { GraphQLJSON } from 'graphql-type-json'

@ObjectType()
export class EstatAreaGeometry {
  @Field()
  id!: string

  @Field(() => GraphQLJSON)
  geometry!: typeof GraphQLJSON

  @Field(() => [Number])
  bbox!: BBox
}
