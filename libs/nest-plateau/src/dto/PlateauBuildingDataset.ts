import { Field, ObjectType } from '@nestjs/graphql'
import { groupBy } from 'lodash'
import objectHash from 'object-hash'
import format from 'string-template'

import { PlateauDataset, PlateauDatasetDatum } from './PlateauDataset'
import { PlateauDatasetFormatEnum } from './PlateauDatasetFormat'
import { type PlateauDatasetTypeEnum } from './PlateauDatasetType'

@ObjectType({
  implements: [PlateauDatasetDatum]
})
class PlateauBuildingDatasetDatum extends PlateauDatasetDatum {
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
  private getData2022(): PlateauBuildingDatasetDatum[] {
    // Strangely, when a LOD doesn't have a datum with non-textured suffix,
    // the only datum of the LOD is *not* textured, which forces me to
    // traverse all the data first.
    const groups = groupBy(
      this.catalog.data.config.data.map(datum => ({
        lod: +datum.name.slice(3, 4),
        datum
      })),
      'lod'
    )
    return Object.values(groups).flatMap(data =>
      data
        .map(({ lod, datum }) => ({
          id: objectHash(datum.url),
          format: PlateauDatasetFormatEnum.Cesium3DTiles,
          url: datum.url,
          name: '',
          version: '2022',
          lod,
          textured: data.length > 1 && !datum.name.includes('テクスチャなし')
        }))
        .sort((a, b) =>
          `${a.lod}-${a.textured ? 1 : 0}`.localeCompare(
            `${b.lod}-${b.textured ? 1 : 0}}`
          )
        )
    )
  }

  private getData2020(): PlateauBuildingDatasetDatum[] {
    // Frustratingly, when there are no files with "low_resolution" suffix, the
    // LOD of the files *without* "low_resolution" suffix is 1, otherwise the
    // LOD of the files *with* "low_resolution" suffix is 1. This also forces me
    // to traverse all the data first.
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
        id: objectHash(file),
        format: PlateauDatasetFormatEnum.Cesium3DTiles,
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

  @Field(() => [PlateauBuildingDatasetDatum])
  get data(): PlateauBuildingDatasetDatum[] {
    return [...this.getData2020(), ...this.getData2022()]
  }
}
