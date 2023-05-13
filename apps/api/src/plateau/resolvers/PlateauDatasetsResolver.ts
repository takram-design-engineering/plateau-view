import { Injectable } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { PlateauDatasetsService } from '../PlateauDatasetsService'
import { PlateauDataset } from '../dto/PlateauDataset'

@Injectable()
@Resolver()
export class PlateauDatasetsResolver {
  constructor(private readonly datasetsService: PlateauDatasetsService) {}

  @Query(() => [PlateauDataset])
  async datasets(): Promise<PlateauDataset[]> {
    return await this.datasetsService.findAll()
  }
}
