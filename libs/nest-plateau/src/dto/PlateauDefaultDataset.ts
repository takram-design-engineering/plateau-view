import { Field, ObjectType } from '@nestjs/graphql'

import { isNotNullish } from '@plateau/type-helpers'

import { PlateauDataset, PlateauDatasetVariant } from './PlateauDataset'
import { cleanPlateauDatasetFormat } from './PlateauDatasetFormat'

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
    if (
      !('config' in this.catalog.data) ||
      this.catalog.data.config == null ||
      this.catalog.data.config.data.length === 0
    ) {
      if (this.catalog.data.format == null || this.catalog.data.url == null) {
        return [] // No variants should be filtered out.
      }
      return [
        {
          format: this.catalog.data.format,
          url: this.catalog.data.url,
          name: this.catalog.data.name
        }
      ]
    }
    return this.catalog.data.config.data
      .map(data => {
        const format = cleanPlateauDatasetFormat(data.type)
        return format != null
          ? {
              format,
              url: data.url,
              name: data.name
            }
          : undefined
      })
      .filter(isNotNullish)
  }
}
