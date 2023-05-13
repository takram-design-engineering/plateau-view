import { Injectable } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { PlateauMunicipalityService } from '../PlateauMunicipalityService'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'

@Injectable()
@Resolver()
export class PlateauMunicipalityResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @Query(() => [PlateauMunicipality])
  async municipalities(): Promise<PlateauMunicipality[]> {
    return await this.municipalityService.findAll()
  }
}
