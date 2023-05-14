import { Injectable } from '@nestjs/common'
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import invariant from 'tiny-invariant'

import { PlateauMunicipalityService } from '../PlateauMunicipalityService'
import { PlateauArea } from '../dto/PlateauArea'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'

@Injectable()
@Resolver(() => PlateauArea)
export class PlateauAreaFieldResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @ResolveField(() => ID)
  id(@Parent() area: PlateauArea): string {
    return area.code
  }

  @ResolveField(() => [PlateauArea])
  async parents(@Parent() area: PlateauArea): Promise<PlateauArea[]> {
    return await Promise.all(
      area.parents.map(async ({ type, code }) => {
        if (type === 'municipality') {
          const municipality = await this.municipalityService.findOne({ code })
          invariant(municipality != null)
          return municipality
        } else if (type === 'prefecture') {
          const prefecture = PlateauPrefecture.values[code]
          invariant(prefecture != null)
          return prefecture
        }
        invariant(false)
      })
    )
  }
}
