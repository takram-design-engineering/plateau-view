import { Field, ObjectType } from '@nestjs/graphql'
import { groupBy } from 'lodash'
import format from 'string-template'

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
    const version = this.version ?? '2020' // Prefer 2020

    if (version === '2022') {
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

    if (version === '2020') {
      // Frustratingly, when there are no files with "low_resolution" suffix,
      // the LOD of the files *without* "low_resolution" suffix is 1, otherwise
      // the LOD of the files *with* "low_resolution" suffix is 1. This also
      // forces me to traverse all the variants first.
      const files = this.storageService.match({
        pattern: format('01_building/{code}_*_2020_bldg_*/tileset.json', {
          code: this.catalog.data.ward_code ?? this.catalog.data.city_code
        }),
        version: '2020',
        fileType: '3dtiles'
      })
      const lod = files.some(file => file.includes('_low_resolution')) ? 2 : 1
      return files.map(file => ({
        lod: file.includes('_low_resolution') ? 1 : lod,
        textured: file.includes('_texture'),
        url: file
      }))
    }

    return []
  }
}
