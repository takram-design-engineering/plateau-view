import { BadRequestException, Injectable } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { PlateauPrefecture } from '../dto/PlateauPrefecture'

@Injectable()
@Resolver()
export class PlateauPrefectureResolver {
  @Query(() => [PlateauPrefecture])
  prefectures(): PlateauPrefecture[] {
    return Object.values(PlateauPrefecture.values)
  }

  @Query(() => PlateauPrefecture, { nullable: true })
  prefecture(@Args('code') code: string): PlateauPrefecture | undefined {
    if (!/^\d{2}$/.test(code)) {
      throw new BadRequestException('Illegal prefecture code')
    }
    return PlateauPrefecture.values[code]
  }
}
