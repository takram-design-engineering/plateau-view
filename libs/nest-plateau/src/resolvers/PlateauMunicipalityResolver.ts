import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

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
    @Args('prefectureCode', { nullable: true }) prefectureCode?: string
  ): Promise<PlateauMunicipality[]> {
    if (prefectureCode != null && !/^\d{2}$/.test(prefectureCode)) {
      throw new BadRequestException('Illegal prefecture code')
    }
    return await this.municipalityService.findAll({ prefectureCode })
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
