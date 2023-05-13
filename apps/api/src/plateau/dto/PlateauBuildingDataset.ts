import { Field, ObjectType } from '@nestjs/graphql'
import { groupBy } from 'lodash'

import { PlateauDataset, type PlateauDatasetType } from './PlateauDataset'

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
export class PlateauBuildingDataset extends PlateauDataset<PlateauDatasetType.Building> {
  @Field(() => [PlateauBuildingDatasetVariant])
  get variants(): PlateauBuildingDatasetVariant[] {
    if (this.catalog.data.config == null) {
      return []
    }
    // Strangely, when a LOD doesn't have a variant with non-textured suffix,
    // the only variant of the LOD is *not* textured, which forces me to
    // traverse all the variants first.
    const groups = groupBy(
      this.catalog.data.config.data.map(variant => ({
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
