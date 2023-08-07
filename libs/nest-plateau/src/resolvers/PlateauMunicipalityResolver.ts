import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from '../dto/PlateauDatasetType'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauMunicipalityService } from '../PlateauMunicipalityService'

@Injectable()
@Resolver()
export class PlateauMunicipalityResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @Query(() => [PlateauMunicipality])
  async municipalities(
    @Args('prefectureCode', { type: () => String, nullable: true })
    prefectureCode?: string | null,
    @Args('datasetType', { type: () => PlateauDatasetTypeEnum, nullable: true })
    datasetType?: PlateauDatasetType | null
  ): Promise<PlateauMunicipality[]> {
    if (prefectureCode != null && !/^\d{2}$/.test(prefectureCode)) {
      throw new BadRequestException('Illegal prefecture code')
    }
    return await this.municipalityService.findAll({
      prefectureCode: prefectureCode ?? undefined,
      datasetType: datasetType ?? undefined
    })
  }

  @Query(() => PlateauMunicipality, { nullable: true })
  async municipality(
    @Args('code') code: string
  ): Promise<PlateauMunicipality | undefined> {
    if (!/^\d{5}$/.test(code)) {
      throw new BadRequestException('Illegal municipality code')
    }
    return await this.municipalityService.findOne({ code })
  }
}
