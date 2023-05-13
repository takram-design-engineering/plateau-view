import { Injectable } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import invariant from 'tiny-invariant'

import { PlateauMunicipalityService } from '../PlateauMunicipalityService'
import { PlateauArea } from '../dto/PlateauArea'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'

@Injectable()
@Resolver(() => PlateauMunicipality)
export class PlateauMunicipalityFieldResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @ResolveField(() => PlateauArea)
  async parent(
    @Parent() municipality: PlateauMunicipality
  ): Promise<PlateauArea> {
    if (municipality.parentCode !== municipality.prefectureCode) {
      const parent = await this.municipalityService.findOne({
        code: municipality.parentCode
      })
      invariant(parent != null)
      return parent
    }
    return new PlateauPrefecture(municipality.prefectureCode)
  }

  @ResolveField(() => PlateauPrefecture)
  prefecture(@Parent() municipality: PlateauMunicipality): PlateauPrefecture {
    return new PlateauPrefecture(municipality.prefectureCode)
  }
}
