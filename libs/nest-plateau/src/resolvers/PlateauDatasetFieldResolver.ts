import { Injectable } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { PlateauMunicipalityService } from '../PlateauMunicipalityService'
import { PlateauDataset } from '../dto/PlateauDataset'
import { PlateauMunicipality } from '../dto/PlateauMunicipality'

@Injectable()
@Resolver(() => PlateauDataset)
export class PlateauDatasetFieldResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @ResolveField(() => PlateauMunicipality, { nullable: true })
  async municipality(
    @Parent() dataset: PlateauDataset
  ): Promise<PlateauMunicipality | undefined> {
    const municipalityCode =
      'ward_code' in dataset.catalog.data &&
      dataset.catalog.data.ward_code != null
        ? dataset.catalog.data.ward_code
        : dataset.catalog.data.city_code
    if (municipalityCode == null) {
      return
    }
    return await this.municipalityService.findOne({ code: municipalityCode })
  }
}
