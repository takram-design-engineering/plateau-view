import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { uniq } from 'lodash'
import invariant from 'tiny-invariant'

import { PlateauPrefecture } from '../dto/PlateauPrefecture'
import { PlateauMunicipalityService } from '../PlateauMunicipalityService'

@Injectable()
@Resolver()
export class PlateauPrefectureResolver {
  constructor(
    private readonly municipalityService: PlateauMunicipalityService
  ) {}

  @Query(() => [PlateauPrefecture])
  async prefectures(): Promise<PlateauPrefecture[]> {
    const municipalities = await this.municipalityService.findAll()
    const prefectureCodes = uniq(
      municipalities.map(municipality => {
        const prefecture = municipality.parents[municipality.parents.length - 1]
        invariant(prefecture.type === 'prefecture')
        return prefecture.code
      })
    )
    return prefectureCodes.sort().map(code => PlateauPrefecture.values[code])
  }

  @Query(() => PlateauPrefecture, { nullable: true })
  prefecture(@Args('code') code: string): PlateauPrefecture | undefined {
    if (!/^\d{2}$/.test(code)) {
      throw new BadRequestException('Illegal prefecture code')
    }
    return PlateauPrefecture.values[code]
  }
}
