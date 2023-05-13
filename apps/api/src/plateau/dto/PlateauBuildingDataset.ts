import { Field, ObjectType } from '@nestjs/graphql'
import { groupBy } from 'lodash'

import { type PlateauCatalog0 } from '../schemas/catalog'
import { PlateauDataset } from './PlateauDataset'

@ObjectType()
class PlateauBuildingDatasetVariant {
  @Field(() => Number)
  lod!: number

  @Field(() => Boolean)
  textured!: boolean

  @Field()
  url!: string
}

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauBuildingDataset extends PlateauDataset<
  PlateauCatalog0 & { type: '建築物モデル' }
> {
  @Field(() => [PlateauBuildingDatasetVariant])
  get variants(): PlateauBuildingDatasetVariant[] {
    if (this.catalog.config == null) {
      return []
    }
    // Strangely, when a LOD doesn't have a variant with non-textured suffix,
    // the only variant of the LOD is *not* textured, which forces me to
    // traverse all the variants first.
    const groups = groupBy(
      this.catalog.config.data.map(variant => ({
        lod: +variant.name.slice(3, 4),
        variant
      })),
      'lod'
    )
    return Object.values(groups).flatMap(variants =>
      variants.map(({ lod, variant }) => ({
        lod,
        textured:
          variants.length > 1 && !variant.name.includes('テクスチャなし'),
        url: variant.url
      }))
    )
  }
}
