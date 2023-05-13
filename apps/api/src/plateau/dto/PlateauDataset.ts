import { Field, InterfaceType } from '@nestjs/graphql'

import { type PlateauCatalog0 } from '../schemas/catalog'

@InterfaceType()
export abstract class PlateauDataset<
  T extends PlateauCatalog0 = PlateauCatalog0
> {
  constructor(readonly catalog: T) {}

  @Field()
  get id(): string {
    return this.catalog.id
  }
}
