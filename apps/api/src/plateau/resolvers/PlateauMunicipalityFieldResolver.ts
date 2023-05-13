import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import invariant from 'tiny-invariant'

import { PlateauCatalogService } from '../PlateauCatalogService'
import { PlateauDataset } from '../dto/PlateauDataset'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'

@Injectable()
@Resolver(() => PlateauMunicipality)
export class PlateauMunicipalityFieldResolver {
  constructor(private readonly catalogService: PlateauCatalogService) {}

  @ResolveField(() => PlateauPrefecture)
  prefecture(@Parent() municipality: PlateauMunicipality): PlateauPrefecture {
    const parent = municipality.parents[municipality.parents.length - 1]
    invariant(parent.type === 'prefecture')
    const prefecture = PlateauPrefecture.values[parent.code]
    invariant(prefecture != null)
    return prefecture
  }

  @ResolveField(() => [PlateauDataset])
  async datasets(
    @Parent() municipality: PlateauMunicipality,
    @Args('version', { type: () => String, nullable: true })
    version?: string
  ): Promise<PlateauDataset[]> {
    if (version != null && version !== '2020' && version !== '2022') {
      throw new BadRequestException('Illegal version')
    }
    return await this.catalogService.findMany({
      municipalityCode: municipality.code,
      version
    })
  }
}
