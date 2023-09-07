import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'

@ObjectType()
export class EstatAreaGeometry {
  @Field()
  id!: string

  @Field(() => GraphQLJSON)
  geometry!: typeof GraphQLJSON
}
