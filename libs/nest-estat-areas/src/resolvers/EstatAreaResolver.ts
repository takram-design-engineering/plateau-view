import { Injectable } from '@nestjs/common'
import { Args, ID, Query, Resolver } from '@nestjs/graphql'

import { EstatArea } from '../dto/EstatArea'
import { EstatAreaGeometry } from '../dto/EstatAreaGeometry'
import { EstatAreasService } from '../EstatAreasService'

@Injectable()
@Resolver()
export class EstatAreaResolver {
  constructor(private readonly service: EstatAreasService) {}

  @Query(() => [EstatArea])
  async areas(
    @Args('searchTokens', { type: () => [String] })
    searchTokens: readonly string[],
    @Args('limit', { type: () => Number, nullable: true })
    limit?: number | null
  ): Promise<EstatArea[]> {
    return await this.service.findAll({
      searchTokens,
      limit: limit ?? undefined
    })
  }

  @Query(() => EstatAreaGeometry, { nullable: true })
  async areaGeometry(
    @Args('areaId', { type: () => ID }) areaId: string
  ): Promise<EstatAreaGeometry | undefined> {
    return await this.service.findGeometry({ areaId })
  }
}
