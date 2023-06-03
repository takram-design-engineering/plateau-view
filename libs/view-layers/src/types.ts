import { type BoundingSphere } from '@cesium/engine'
import { type PrimitiveAtom } from 'jotai'

import { type LayerListItemProps } from '@takram/plateau-ui-components'

import { type BridgeLayerModel } from './BridgeLayer'
import { type BuildingLayerModel } from './BuildingLayer'
import { type LandSlideRiskLayerModel } from './LandSlideRiskLayer'
import { type LandUseLayerModel } from './LandUseLayer'
import { type RiverFloodingRiskLayerModel } from './RiverFloodingRiskLayer'
import { type RoadLayerModel } from './RoadLayer'
import { type UrbanPlanningLayerModel } from './UrbanPlanningLayer'
import {
  type BORDER_LAYER,
  type BRIDGE_LAYER,
  type BUILDING_LAYER,
  type CITY_FURNITURE_LAYER,
  type EMERGENCY_ROUTE_LAYER,
  type GENERIC_CITY_OBJECT_LAYER,
  type HIGH_TIDE_RISK_LAYER,
  type INLAND_FLOODING_RISK_LAYER,
  type LANDMARK_LAYER,
  type LANDSLIDE_LAYER,
  type LAND_USE_LAYER,
  type PARK_LAYER,
  type RAILWAY_LAYER,
  type RIVER_FLOODING_RISK_LAYER,
  type ROAD_LAYER,
  type SHELTER_LAYER,
  type STATION_LAYER,
  type TSUNAMI_RISK_LAYER,
  type URBAN_PLANNING_LAYER,
  type USE_CASE_LAYER,
  type VEGETATION_LAYER
} from './layerTypes'

export type LayerTitle = LayerListItemProps['title']

declare module '@takram/plateau-layers' {
  interface LayerModelBase {
    titleAtom: PrimitiveAtom<LayerTitle | null>
    loadingAtom: PrimitiveAtom<boolean>
    hiddenAtom: PrimitiveAtom<boolean>
    boundingSphereAtom: PrimitiveAtom<BoundingSphere | null>
  }

  interface LayerModelOverrides {
    [BORDER_LAYER]: never // BorderLayerModel
    [BRIDGE_LAYER]: BridgeLayerModel
    [BUILDING_LAYER]: BuildingLayerModel
    [CITY_FURNITURE_LAYER]: never // CityFurnitureLayerModel
    [EMERGENCY_ROUTE_LAYER]: never // EmergencyRouteLayerModel
    [GENERIC_CITY_OBJECT_LAYER]: never // GenericLayerModel
    [HIGH_TIDE_RISK_LAYER]: never // HighTideRiskLayerModel
    [INLAND_FLOODING_RISK_LAYER]: never // InlandFloodingRiskLayerModel
    [LAND_USE_LAYER]: LandUseLayerModel
    [LANDMARK_LAYER]: never // LandmarkLayerModel
    [LANDSLIDE_LAYER]: LandSlideRiskLayerModel
    [PARK_LAYER]: never // ParkLayerModel
    [RAILWAY_LAYER]: never // RailwayLayerModel
    [RIVER_FLOODING_RISK_LAYER]: RiverFloodingRiskLayerModel
    [ROAD_LAYER]: RoadLayerModel
    [SHELTER_LAYER]: never // ShelterLayerModel
    [STATION_LAYER]: never // StationLayerModel
    [TSUNAMI_RISK_LAYER]: never // TsunamiRiskLayerModel
    [URBAN_PLANNING_LAYER]: UrbanPlanningLayerModel
    [USE_CASE_LAYER]: never // UseCaseLayerModel
    [VEGETATION_LAYER]: never // VegetationLayerModel
  }
}
