import { Field, InterfaceType } from '@nestjs/graphql'

import { type PlateauStorageService } from '../PlateauStorageService'
import { cleanseDatasetName } from '../helpers/cleanseDatasetName'
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
export abstract class PlateauDatasetDatum {
  @Field(() => PlateauDatasetFormatEnum)
  format!: PlateauDatasetFormat

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
    return cleanseDatasetName(this.catalog.data.name, this.catalog)
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

  @Field(() => [PlateauDatasetDatum])
  abstract readonly data: PlateauDatasetDatum[]
}
