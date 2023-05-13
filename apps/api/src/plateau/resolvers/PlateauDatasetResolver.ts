import { Injectable } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { PlateauCatalogService } from '../PlateauCatalogService'
import { PlateauDataset } from '../dto/PlateauDataset'

@Injectable()
@Resolver()
export class PlateauDatasetResolver {
  constructor(private readonly service: PlateauCatalogService) {}

  @Query(() => [PlateauDataset])
  async datasets(): Promise<PlateauDataset[]> {
    return await this.service.findAll()
  }
}
