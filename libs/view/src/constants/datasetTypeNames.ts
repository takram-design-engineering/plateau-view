import { PlateauDatasetType } from '@takram/plateau-graphql'

export const datasetTypeNames: Record<PlateauDatasetType, string> = {
  [PlateauDatasetType.Border]: '行政界',
  [PlateauDatasetType.Bridge]: '橋梁',
  [PlateauDatasetType.Building]: '建築物',
  [PlateauDatasetType.EmergencyRoute]: '緊急輸送道路',
  [PlateauDatasetType.Facility]: '都市計画',
  [PlateauDatasetType.Flood]: '洪水浸水想定区域',
  [PlateauDatasetType.Furniture]: '都市設備',
  [PlateauDatasetType.Generic]: 'その他',
  [PlateauDatasetType.Hightide]: '高潮浸水想定区域',
  [PlateauDatasetType.InlandFlood]: '内水浸水想定区域',
  [PlateauDatasetType.Landmark]: 'ランドマーク',
  [PlateauDatasetType.Landslide]: '土砂災害警戒区域',
  [PlateauDatasetType.Landuse]: '土地利用',
  [PlateauDatasetType.Park]: '公園',
  [PlateauDatasetType.Railway]: '線路',
  [PlateauDatasetType.Road]: '道路',
  [PlateauDatasetType.Shelter]: '避難施設',
  [PlateauDatasetType.Station]: '鉄道駅',
  [PlateauDatasetType.Tsunami]: '津波浸水想定区域',
  [PlateauDatasetType.UseCase]: 'ユースケース',
  [PlateauDatasetType.Vegetation]: '植生'
}
