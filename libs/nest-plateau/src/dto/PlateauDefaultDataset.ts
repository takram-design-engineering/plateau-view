import { Field, ObjectType } from '@nestjs/graphql'
import objectHash from 'object-hash'

import { isNotNullish } from '@takram/plateau-type-helpers'

import { cleanseDatasetFormat } from '../helpers/cleanseDatasetFormat'
import { cleanseDatasetName } from '../helpers/cleanseDatasetName'
import { PlateauDataset, PlateauDatasetDatum } from './PlateauDataset'

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
          id: objectHash(this.catalog.data.url),
          format: this.catalog.data.format,
          url: this.catalog.data.url,
          name: cleanseDatasetName(this.catalog.data.name, this.catalog)
        }
      ]
    }
    return this.catalog.data.config.data
      .map(data => {
        const format = cleanseDatasetFormat(data.type)
        return format != null
          ? {
              id: objectHash(data.url),
              format,
              url: data.url,
              name: cleanseDatasetName(data.name, this.catalog)
            }
          : undefined
      })
      .filter(isNotNullish)
  }
}
