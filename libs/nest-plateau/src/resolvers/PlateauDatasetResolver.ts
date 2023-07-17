import { Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { PlateauDataset } from '../dto/PlateauDataset'
import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from '../dto/PlateauDatasetType'
import { PlateauCatalogService } from '../PlateauCatalogService'

@Injectable()
@Resolver()
export class PlateauDatasetResolver {
  constructor(private readonly catalogService: PlateauCatalogService) {}

  @Query(() => [PlateauDataset])
  async datasets(
    @Args('includeTypes', {
      type: () => [PlateauDatasetTypeEnum],
      nullable: true
    })
    includeTypes?: readonly PlateauDatasetType[],
    @Args('excludeTypes', {
      type: () => [PlateauDatasetTypeEnum],
      nullable: true
    })
    excludeTypes?: readonly PlateauDatasetType[],
    @Args('searchTokens', {
      type: () => [String],
      nullable: true
    })
    searchTokens?: readonly string[]
  ): Promise<PlateauDataset[]> {
    return await this.catalogService.findAll({
      includeTypes,
      excludeTypes,
      searchTokens
    })
  }
}
