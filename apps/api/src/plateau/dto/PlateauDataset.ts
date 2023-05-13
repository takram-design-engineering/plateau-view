import { Field, InterfaceType } from '@nestjs/graphql'

import { type PlateauCatalog0 } from '../schemas/catalog'

@InterfaceType()
export abstract class PlateauDataset {
  constructor(readonly catalog: PlateauCatalog0) {}

  @Field()
  get id(): string {
    return this.catalog.id
  }
}
