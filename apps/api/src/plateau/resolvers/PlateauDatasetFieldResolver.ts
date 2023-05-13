import { Injectable } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { PlateauDataset } from '../dto/PlateauDataset'

@Injectable()
@Resolver(() => PlateauDataset)
export class PlateauDatasetFieldResolver {
  @ResolveField()
  type(@Parent() dataset: PlateauDataset): string {
    return dataset.catalog.data.type
  }
}
