import { Field, InterfaceType } from '@nestjs/graphql'

import { type PlateauCatalog } from './PlateauCatalog'

export const enum PlateauDatasetType {
  Border = '行政界情報',
  Bridge = '橋梁モデル',
  Building = '建築物モデル',
  EmergencyRoute = '緊急輸送道路情報',
  Facility = '都市計画決定情報モデル',
  Flood = '洪水浸水想定区域モデル',
  Furniture = '都市設備モデル',
  Generic = '汎用都市オブジェクトモデル',
  Hightide = '高潮浸水想定区域モデル',
  InlandFlood = '内水浸水想定区域モデル',
  Landmark = 'ランドマーク情報',
  Landslide = '土砂災害警戒区域モデル',
  Landuse = '土地利用モデル',
  Park = '公園情報',
  Railway = '鉄道情報',
  Road = '道路モデル',
  Shelter = '避難施設情報',
  Station = '鉄道駅情報',
  Tsunami = '津波浸水想定区域モデル',
  UseCase = 'ユースケース',
  Vegetation = '植生モデル'
}

@InterfaceType()
export abstract class PlateauDataset<
  T extends PlateauDatasetType = PlateauDatasetType
> {
  constructor(readonly catalog: PlateauCatalog<`${T}`>) {}

  @Field()
  get id(): string {
    return this.catalog.data.id
  }
}
