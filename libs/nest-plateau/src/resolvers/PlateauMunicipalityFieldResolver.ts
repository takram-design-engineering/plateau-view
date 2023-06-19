import { Injectable } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import invariant from 'tiny-invariant'

import { PlateauDataset } from '../dto/PlateauDataset'
import {
  PlateauDatasetTypeEnum,
  type PlateauDatasetType
} from '../dto/PlateauDatasetType'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'
import { PlateauCatalogService } from '../PlateauCatalogService'

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
    @Args('includeTypes', {
      type: () => [PlateauDatasetTypeEnum],
      nullable: true
    })
    includeTypes?: readonly PlateauDatasetType[],
    @Args('excludeTypes', {
      type: () => [PlateauDatasetTypeEnum],
      nullable: true
    })
    excludeTypes?: readonly PlateauDatasetType[]
  ): Promise<PlateauDataset[]> {
    return await this.catalogService.findAll({
      municipalityCode: municipality.code,
      includeTypes,
      excludeTypes
    })
  }
}
