import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EstatArea {
  @Field(() => ID)
  id!: string

  @Field()
  prefectureCode!: string

  @Field()
  municipalityCode!: string

  @Field()
  name!: string

  @Field()
  address!: string

  @Field(() => [String])
  addressComponents!: string[]

  @Field(() => [Number])
  bbox!: [number, number, number, number]
}
