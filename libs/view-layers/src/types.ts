import { type PrimitiveAtom } from 'jotai'

import { type BridgeLayerModel } from './BridgeLayer'
import { type BuildingLayerModel } from './BuildingLayer'
import { type FacilityLayerModel } from './FacilityLayer'
import { type FloodLayerModel } from './FloodLayer'
import { type LandslideLayerModel } from './LandslideLayer'
import { type LanduseLayerModel } from './LanduseLayer'
import { type RoadLayerModel } from './RoadLayer'
import {
  type BORDER_LAYER,
  type BRIDGE_LAYER,
  type BUILDING_LAYER,
  type EMERGENCY_ROUTE_LAYER,
  type FACILITY_LAYER,
  type FLOOD_LAYER,
  type FURNITURE_LAYER,
  type GENERIC_LAYER,
  type HIGHTIDE_LAYER,
  type INLAND_FLOOD_LAYER,
  type LANDMARK_LAYER,
  type LANDSLIDE_LAYER,
  type LANDUSE_LAYER,
  type PARK_LAYER,
  type RAILWAY_LAYER,
  type ROAD_LAYER,
  type SHELTER_LAYER,
  type STATION_LAYER,
  type TSUNAMI_LAYER,
  type USE_CASE_LAYER,
  type VEGETATION_LAYER
} from './layerTypes'

export type LayerTitle =
  | string
  | {
      primary: string
      secondary?: string
    }

declare module '@takram/plateau-layers' {
  interface LayerModel {
    titleAtom: PrimitiveAtom<LayerTitle | null>
    loadingAtom: PrimitiveAtom<boolean>
    hiddenAtom: PrimitiveAtom<boolean>
    selectedAtom: PrimitiveAtom<boolean>
  }

  interface LayerModelOverrides {
    [BORDER_LAYER]: never // BorderLayerModel
    [BRIDGE_LAYER]: BridgeLayerModel
    [BUILDING_LAYER]: BuildingLayerModel
    [EMERGENCY_ROUTE_LAYER]: never // EmergencyRouteLayerModel
    [FACILITY_LAYER]: FacilityLayerModel
    [FLOOD_LAYER]: FloodLayerModel
    [FURNITURE_LAYER]: never // FurnitureLayerModel
    [GENERIC_LAYER]: never // GenericLayerModel
    [HIGHTIDE_LAYER]: never // HightideLayerModel
    [INLAND_FLOOD_LAYER]: never // InlandFloodLayerModel
    [LANDMARK_LAYER]: never // LandmarkLayerModel
    [LANDSLIDE_LAYER]: LandslideLayerModel
    [LANDUSE_LAYER]: LanduseLayerModel
    [PARK_LAYER]: never // ParkLayerModel
    [RAILWAY_LAYER]: never // RailwayLayerModel
    [ROAD_LAYER]: RoadLayerModel
    [SHELTER_LAYER]: never // ShelterLayerModel
    [STATION_LAYER]: never // StationLayerModel
    [TSUNAMI_LAYER]: never // TsunamiLayerModel
    [USE_CASE_LAYER]: never // UseCaseLayerModel
    [VEGETATION_LAYER]: never // VegetationLayerModel
  }
}
