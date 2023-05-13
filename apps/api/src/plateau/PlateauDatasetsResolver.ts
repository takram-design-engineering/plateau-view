import { Injectable } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { PlateauCatalogService } from './PlateauCatalogService'
import { PlateauCatalogDataset } from './dto/PlateauCatalogDataset'

@Injectable()
@Resolver()
export class PlateauDatasetsResolver {
  constructor(private readonly catalogService: PlateauCatalogService) {}

  @Query(() => [PlateauCatalogDataset])
  async datasets(): Promise<PlateauCatalogDataset[]> {
    return await this.catalogService.findAll()
  }
}
