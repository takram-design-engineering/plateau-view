import { type LayerType } from '@plateau/layers'
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
} from '@plateau/view-layers'

// TODO: Move to library other than UI.
export const layerTypeNames: Record<LayerType, string | undefined> = {
  [BORDER_LAYER]: '行政界情報',
  [BRIDGE_LAYER]: '橋梁モデル',
  [BUILDING_LAYER]: '建築物モデル',
  [EMERGENCY_ROUTE_LAYER]: '緊急輸送道路情報',
  [FACILITY_LAYER]: '都市計画決定情報モデル',
  [FLOOD_LAYER]: '洪水浸水想定区域モデル',
  [FURNITURE_LAYER]: '都市設備モデル',
  [GENERIC_LAYER]: '汎用都市オブジェクトモデル',
  [HIGHTIDE_LAYER]: '高潮浸水想定区域モデル',
  [INLAND_FLOOD_LAYER]: '内水浸水想定区域モデル',
  [LANDMARK_LAYER]: 'ランドマーク情報',
  [LANDSLIDE_LAYER]: '土砂災害警戒区域モデル',
  [LANDUSE_LAYER]: '土地利用モデル',
  [PARK_LAYER]: '公園情報',
  [RAILWAY_LAYER]: '鉄道情報',
  [ROAD_LAYER]: '道路モデル',
  [SHELTER_LAYER]: '避難施設情報',
  [STATION_LAYER]: '鉄道駅情報',
  [TSUNAMI_LAYER]: '津波浸水想定区域モデル',
  [USE_CASE_LAYER]: 'ユースケース',
  [VEGETATION_LAYER]: '植生モデル'
}
