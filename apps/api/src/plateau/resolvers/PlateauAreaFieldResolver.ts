import { Injectable } from '@nestjs/common'
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { PlateauArea } from '../dto/PlateauArea'

@Injectable()
@Resolver(() => PlateauArea)
export class PlateauAreaFieldResolver {
  @ResolveField(() => ID)
  id(@Parent() area: PlateauArea): string {
    return area.code
  }
}
