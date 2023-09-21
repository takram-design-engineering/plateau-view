import { type LayerType } from '@takram/plateau-layers'

import {
  BORDER_LAYER,
  BRIDGE_LAYER,
  BUILDING_LAYER,
  CITY_FURNITURE_LAYER,
  EMERGENCY_ROUTE_LAYER,
  GENERIC_CITY_OBJECT_LAYER,
  HEATMAP_LAYER,
  HIGH_TIDE_RISK_LAYER,
  INLAND_FLOODING_RISK_LAYER,
  LAND_SLIDE_RISK_LAYER,
  LAND_USE_LAYER,
  LANDMARK_LAYER,
  PARK_LAYER,
  PEDESTRIAN_LAYER,
  RAILWAY_LAYER,
  RIVER_FLOODING_RISK_LAYER,
  ROAD_LAYER,
  SHELTER_LAYER,
  SKETCH_LAYER,
  STATION_LAYER,
  TSUNAMI_RISK_LAYER,
  URBAN_PLANNING_LAYER,
  USE_CASE_LAYER,
  VEGETATION_LAYER
} from './layerTypes'

export const layerTypeNames: Record<LayerType, string> = {
  [HEATMAP_LAYER]: '統計データ',
  [PEDESTRIAN_LAYER]: '歩行者視点',
  [SKETCH_LAYER]: '作図',

  // Dataset layers
  [BORDER_LAYER]: '行政界',
  [BRIDGE_LAYER]: '橋梁',
  [BUILDING_LAYER]: '建築物',
  [CITY_FURNITURE_LAYER]: '都市設備',
  [EMERGENCY_ROUTE_LAYER]: '緊急輸送道路',
  [GENERIC_CITY_OBJECT_LAYER]: 'その他',
  [HIGH_TIDE_RISK_LAYER]: '高潮浸水想定区域',
  [INLAND_FLOODING_RISK_LAYER]: '内水浸水想定区域',
  [LAND_USE_LAYER]: '土地利用',
  [LANDMARK_LAYER]: 'ランドマーク',
  [LAND_SLIDE_RISK_LAYER]: '土砂災害警戒区域',
  [PARK_LAYER]: '公園',
  [RAILWAY_LAYER]: '線路',
  [RIVER_FLOODING_RISK_LAYER]: '洪水浸水想定区域',
  [ROAD_LAYER]: '道路',
  [SHELTER_LAYER]: '避難施設',
  [STATION_LAYER]: '鉄道駅',
  [TSUNAMI_RISK_LAYER]: '津波浸水想定区域',
  [URBAN_PLANNING_LAYER]: '都市計画',
  [USE_CASE_LAYER]: 'ユースケース',
  [VEGETATION_LAYER]: '植生'
}
