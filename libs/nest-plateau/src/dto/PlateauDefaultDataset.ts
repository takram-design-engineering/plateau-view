import { Field, ObjectType } from '@nestjs/graphql'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { PlateauDataset, PlateauDatasetDatum } from './PlateauDataset'
import { cleansePlateauDatasetFormat } from './PlateauDatasetFormat'

@ObjectType({
  implements: [PlateauDatasetDatum]
})
class PlateauDefaultDatasetDatum extends PlateauDatasetDatum {}

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauDefaultDataset extends PlateauDataset {
  @Field(() => [PlateauDefaultDatasetDatum])
  get data(): PlateauDefaultDatasetDatum[] {
    if (
      !('config' in this.catalog.data) ||
      this.catalog.data.config == null ||
      this.catalog.data.config.data.length === 0
    ) {
      if (this.catalog.data.format == null || this.catalog.data.url == null) {
        return [] // Exclude useless data
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
        const format = cleansePlateauDatasetFormat(data.type)
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
