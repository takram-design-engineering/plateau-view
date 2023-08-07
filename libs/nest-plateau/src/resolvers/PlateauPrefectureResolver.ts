import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from '../dto/PlateauDatasetType'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'
import { PlateauPrefectureService } from '../PlateauPrefectureService'

@Injectable()
@Resolver()
export class PlateauPrefectureResolver {
  constructor(private readonly prefectureService: PlateauPrefectureService) {}

  @Query(() => [PlateauPrefecture])
  async prefectures(
    @Args('datasetType', { type: () => PlateauDatasetTypeEnum, nullable: true })
    datasetType?: PlateauDatasetType | null
  ): Promise<PlateauPrefecture[]> {
    return await this.prefectureService.findAll({
      datasetType: datasetType ?? undefined
    })
  }

  @Query(() => PlateauPrefecture, { nullable: true })
  prefecture(@Args('code') code: string): PlateauPrefecture | undefined {
    if (!/^\d{2}$/.test(code)) {
      throw new BadRequestException('Illegal prefecture code')
    }
    return this.prefectureService.findOne({ code })
  }
}
