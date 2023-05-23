import { type LayerType } from '@takram/plateau-layers'

import {
  BORDER_LAYER,
  BRIDGE_LAYER,
  BUILDING_LAYER,
  EMERGENCY_ROUTE_LAYER,
  FACILITY_LAYER,
  FLOOD_LAYER,
  FURNITURE_LAYER,
  GENERIC_LAYER,
  HIGHTIDE_LAYER,
  INLAND_FLOOD_LAYER,
  LANDMARK_LAYER,
  LANDSLIDE_LAYER,
  LANDUSE_LAYER,
  PARK_LAYER,
  RAILWAY_LAYER,
  ROAD_LAYER,
  SHELTER_LAYER,
  STATION_LAYER,
  TSUNAMI_LAYER,
  USE_CASE_LAYER,
  VEGETATION_LAYER
} from './layerTypes'

export const layerTypeNames: Record<LayerType, string> = {
  [BORDER_LAYER]: '行政界',
  [BRIDGE_LAYER]: '橋梁',
  [BUILDING_LAYER]: '建築物',
  [EMERGENCY_ROUTE_LAYER]: '緊急輸送道路',
  [FACILITY_LAYER]: '都市計画',
  [FLOOD_LAYER]: '洪水浸水想定区域',
  [FURNITURE_LAYER]: '都市設備',
  [GENERIC_LAYER]: 'その他',
  [HIGHTIDE_LAYER]: '高潮浸水想定区域',
  [INLAND_FLOOD_LAYER]: '内水浸水想定区域',
  [LANDMARK_LAYER]: 'ランドマーク',
  [LANDSLIDE_LAYER]: '土砂災害警戒区域',
  [LANDUSE_LAYER]: '土地利用',
  [PARK_LAYER]: '公園',
  [RAILWAY_LAYER]: '線路',
  [ROAD_LAYER]: '道路',
  [SHELTER_LAYER]: '避難施設',
  [STATION_LAYER]: '鉄道駅',
  [TSUNAMI_LAYER]: '津波浸水想定区域',
  [USE_CASE_LAYER]: 'ユースケース',
  [VEGETATION_LAYER]: '植生'
}
