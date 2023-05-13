import { Injectable } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import invariant from 'tiny-invariant'

import { PlateauMunicipality } from '../dto/PlateauMunicipality'
import { PlateauPrefecture } from '../dto/PlateauPrefecture'

@Injectable()
@Resolver(() => PlateauMunicipality)
export class PlateauMunicipalityFieldResolver {
  @ResolveField(() => PlateauPrefecture)
  prefecture(@Parent() municipality: PlateauMunicipality): PlateauPrefecture {
    const parent = municipality.parents[municipality.parents.length - 1]
    invariant(parent.type === 'prefecture')
    const prefecture = PlateauPrefecture.values[parent.code]
    invariant(prefecture != null)
    return prefecture
  }
}
