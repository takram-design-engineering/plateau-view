import { Field, ObjectType } from '@nestjs/graphql'

import { isNotNullish } from '@plateau/type-helpers'

import { PlateauDataset, PlateauDatasetVariant } from '../PlateauDataset'
import { cleanPlateauDatasetFormat } from '../PlateauDatasetFormat'

@ObjectType({
  implements: [PlateauDatasetVariant]
})
class PlateauDefaultDatasetVariant extends PlateauDatasetVariant {}

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauDefaultDataset extends PlateauDataset {
  @Field(() => [PlateauDefaultDatasetVariant])
  get variants(): PlateauDefaultDatasetVariant[] {
    return 'config' in this.catalog.data
      ? this.catalog.data.config?.data
          .map(data => {
            const type = cleanPlateauDatasetFormat(data.type)
            return type != null
              ? {
                  type,
                  url: data.url,
                  name: data.name
                }
              : undefined
          })
          .filter(isNotNullish) ?? []
      : []
  }
}
