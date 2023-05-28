import { registerEnumType } from '@nestjs/graphql'

// Excludes フォルダ and 鉄道モデル
export enum PlateauDatasetTypeEnum {
  Border = '行政界情報',
  Bridge = '橋梁モデル',
  Building = '建築物モデル',
  CityFurniture = '都市設備モデル',
  EmergencyRoute = '緊急輸送道路情報',
  GenericCityObject = '汎用都市オブジェクトモデル',
  HighTideRisk = '高潮浸水想定区域モデル',
  InlandFloodingRisk = '内水浸水想定区域モデル',
  Landmark = 'ランドマーク情報',
  LandSlideRisk = '土砂災害警戒区域モデル',
  LandUse = '土地利用モデル',
  Park = '公園情報',
  Railway = '鉄道情報',
  RiverFloodingRisk = '洪水浸水想定区域モデル',
  Road = '道路モデル',
  Shelter = '避難施設情報',
  Station = '鉄道駅情報',
  TsunamiRisk = '津波浸水想定区域モデル',
  UrbanPlanning = '都市計画決定情報モデル',
  UseCase = 'ユースケース',
  Vegetation = '植生モデル'
}

export type PlateauDatasetType = `${PlateauDatasetTypeEnum}`

registerEnumType(PlateauDatasetTypeEnum, {
  name: 'PlateauDatasetType'
})
