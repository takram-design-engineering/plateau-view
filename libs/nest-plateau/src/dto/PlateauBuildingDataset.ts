import { Field, ObjectType } from '@nestjs/graphql'
import { groupBy } from 'lodash'
import format from 'string-template'

import { PlateauDataset, PlateauDatasetVariant } from './PlateauDataset'
import { PlateauDatasetFormatEnum } from './PlateauDatasetFormat'
import { type PlateauDatasetTypeEnum } from './PlateauDatasetType'

@ObjectType({
  implements: [PlateauDatasetVariant]
})
class PlateauBuildingDatasetVariant extends PlateauDatasetVariant {
  @Field()
  version!: string

  @Field(() => Number)
  lod!: number

  @Field(() => Boolean)
  textured!: boolean
}

@ObjectType({
  implements: [PlateauDataset]
})
export class PlateauBuildingDataset extends PlateauDataset<PlateauDatasetTypeEnum.Building> {
  private getVariants2022(): PlateauBuildingDatasetVariant[] {
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
      variants
        .map(({ lod, variant }) => ({
          type: PlateauDatasetFormatEnum.Cesium3DTiles,
          url: variant.url,
          name: '',
          version: '2022',
          lod,
          textured:
            variants.length > 1 && !variant.name.includes('テクスチャなし')
        }))
        .sort((a, b) =>
          `${a.lod}-${a.textured ? 1 : 0}`.localeCompare(
            `${b.lod}-${b.textured ? 1 : 0}}`
          )
        )
    )
  }

  private getVariants2020(): PlateauBuildingDatasetVariant[] {
    // Frustratingly, when there are no files with "low_resolution" suffix, the
    // LOD of the files *without* "low_resolution" suffix is 1, otherwise the
    // LOD of the files *with* "low_resolution" suffix is 1. This also forces me
    // to traverse all the variants first.
    const files = this.storageService.match({
      pattern: format('01_building/{code}_*_2020_bldg_*/tileset.json', {
        code: this.catalog.data.ward_code ?? this.catalog.data.city_code
      }),
      version: '2020',
      fileType: PlateauDatasetFormatEnum.Cesium3DTiles
    })
    const lod = files.some(file => file.includes('_low_resolution')) ? 2 : 1
    return files
      .map(file => ({
        type: PlateauDatasetFormatEnum.Cesium3DTiles,
        url: file,
        name: '',
        version: '2020',
        lod: file.includes('_low_resolution') ? 1 : lod,
        textured: file.includes('_texture')
      }))
      .sort((a, b) =>
        `${a.lod}-${a.textured ? 1 : 0}`.localeCompare(
          `${b.lod}-${b.textured ? 1 : 0}}`
        )
      )
  }

  @Field(() => [PlateauBuildingDatasetVariant])
  get variants(): PlateauBuildingDatasetVariant[] {
    return [...this.getVariants2020(), ...this.getVariants2022()]
  }
}
