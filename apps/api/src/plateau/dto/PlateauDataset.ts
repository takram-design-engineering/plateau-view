import { Field, InterfaceType } from '@nestjs/graphql'

import { type PlateauStorageService } from '../PlateauStorageService'
import { type PlateauCatalog } from './PlateauCatalog'
import {
  PlateauDatasetFormat,
  PlateauDatasetFormatEnum
} from './PlateauDatasetFormat'
import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from './PlateauDatasetType'

@InterfaceType()
export abstract class PlateauDatasetVariant {
  @Field(() => PlateauDatasetFormatEnum)
  type!: PlateauDatasetFormat

  @Field()
  url!: string

  @Field()
  name!: string
}

@InterfaceType()
export abstract class PlateauDataset<
  T extends PlateauDatasetType = PlateauDatasetType
> {
  constructor(
    readonly catalog: PlateauCatalog<`${T}`>,
    readonly storageService: PlateauStorageService
  ) {}

  @Field()
  get id(): string {
    return this.catalog.data.id
  }

  @Field()
  get name(): string {
    return this.catalog.data.name
  }

  @Field(() => PlateauDatasetTypeEnum)
  get type(): PlateauDatasetType {
    return this.catalog.data.type
  }

  @Field()
  get typeName(): string {
    return this.catalog.data.type
  }

  @Field(() => String, { nullable: true })
  get description(): string | undefined {
    return this.catalog.data.desc
  }

  @Field(() => [PlateauDatasetVariant])
  abstract readonly variants: PlateauDatasetVariant[]
}
