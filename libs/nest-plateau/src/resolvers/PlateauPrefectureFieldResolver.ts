import { Injectable } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'
import { PlateauMunicipalityService } from '../PlateauMunicipalityService'

@Injectable()
@Resolver(() => PlateauPrefecture)
export class PlateauPrefectureFieldResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @ResolveField(() => [PlateauMunicipality])
  async municipalities(
    @Parent() prefecture: PlateauPrefecture
  ): Promise<PlateauMunicipality[]> {
    return await this.municipalityService.findAll({
      prefectureCode: prefecture.code
    })
  }
}
