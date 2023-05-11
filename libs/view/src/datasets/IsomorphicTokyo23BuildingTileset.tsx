import { useAtomValue } from 'jotai'
import { type FC } from 'react'
import invariant from 'tiny-invariant'

import { PlateauTileset, type PlateauTilesetProps } from '@plateau/datasets'

import { plateauDataSourceAtom } from '../states/app'
import { type PlateauDataSource } from './PlateauDataSource'

// Derived from https://api.plateau.reearth.io/datacatalog/plateau-2022
// Their API is too slow (7 secs to fetch) and the payload is too large (500kb).
// Datasets include UUID in their URLs and we cannot make requests directly.
// They should have "latest" tag for retrieving the latest version without UUID.
const cmsBaseUrl = 'https://assets.cms.plateau.reearth.io/assets'
const cmsUrls: Record<string, string> = {
  '13101_chiyoda-ku': `${cmsBaseUrl}/4f/702958-5009-4d6b-a2e0-157c7e573eb2/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13101_chiyoda-ku_lod2_no_texture/tileset.json`,
  '13102_chuo-ku': `${cmsBaseUrl}/e3/3d92a0-f6a1-4fb9-98d6-b168fac950c0/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13102_chuo-ku_lod2_no_texture/tileset.json`,
  '13103_minato-ku': `${cmsBaseUrl}/cb/6917c3-a923-4728-9e5b-0ee47839d280/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13103_minato-ku_lod2_no_texture/tileset.json`,
  '13104_shinjuku-ku': `${cmsBaseUrl}/50/d2d4e2-4e09-4aac-9fba-856c05953d0f/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13104_shinjuku-ku_lod2_no_texture/tileset.json`,
  '13105_bunkyo-ku': `${cmsBaseUrl}/c4/29fcc7-efaa-4412-b13e-0eaa502e9058/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13105_bunkyo-ku_lod2_no_texture/tileset.json`,
  '13108_koto-ku': `${cmsBaseUrl}/46/c74f70-20f2-4f34-a99b-f5f65496d645/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13108_koto-ku_lod2_no_texture/tileset.json`,
  '13109_shinagawa-ku': `${cmsBaseUrl}/a2/ab3960-6614-4d7c-a619-8d8b1eebc6b9/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13109_shinagawa-ku_lod2_no_texture/tileset.json`,
  '13111_ota-ku': `${cmsBaseUrl}/bb/1f866d-242d-4120-b3c9-de2cb65914ef/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13111_ota-ku_lod2_no_texture/tileset.json`,
  '13113_shibuya-ku': `${cmsBaseUrl}/bc/a665a0-00cd-4298-bd57-d00cae98527f/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13113_shibuya-ku_lod2_no_texture/tileset.json`,
  '13116_toshima-ku': `${cmsBaseUrl}/6f/2efec5-c464-4ac4-aaa8-4ae604b4fd8b/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13116_toshima-ku_lod2_no_texture/tileset.json`,
  '13119_itabashi-ku': `${cmsBaseUrl}/76/2a11e8-e39c-4c1a-8a58-9bed2fc2673e/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13119_itabashi-ku_lod2_no_texture/tileset.json`
}

// Deal with the hell of naming inconsistency.
function makeUrl(name: string, dataSource: PlateauDataSource): string {
  const url =
    dataSource === '2020'
      ? `${process.env.NEXT_PUBLIC_DATA_BASE_URL}/plateau/13100_tokyo23ku_2020_3Dtiles_etc_1_op/01_building/${name}_2020_bldg_notexture/tileset.json`
      : dataSource === '2022'
      ? // We cannot know which tilesets have lod2; just assume they have.
        `${process.env.NEXT_PUBLIC_DATA_BASE_URL}/plateau/13100_tokyo23-ku_2022_3dtiles-mvt_1_2_op/bldg_${name}_lod2_no_texture/tileset.json`
      : dataSource === 'cms'
      ? cmsUrls[name]
      : undefined
  invariant(url != null)
  return url
}

export interface IsomorphicTokyo23BuildingTilesetProps
  extends Omit<PlateauTilesetProps, 'url'> {
  name: string
  dataSource?: PlateauDataSource
}

export const IsomorphicTokyo23BuildingTileset: FC<
  IsomorphicTokyo23BuildingTilesetProps
> = ({ name, dataSource, ...props }) => {
  const defaultVersion = useAtomValue(plateauDataSourceAtom)
  return (
    <PlateauTileset
      {...props}
      url={makeUrl(name, dataSource ?? defaultVersion)}
    />
  )
}
