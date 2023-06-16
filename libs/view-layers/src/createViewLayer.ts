import { type SetOptional } from 'type-fest'

import { type LayerModel, type LayerType } from '@takram/plateau-layers'

import { createBridgeLayer, type BridgeLayerModelParams } from './BridgeLayer'
import {
  createBuildingLayer,
  type BuildingLayerModelParams
} from './BuildingLayer'
import {
  createLandSlideRiskLayer,
  type LandSlideRiskLayerModelParams
} from './LandSlideRiskLayer'
import {
  createLandUseLayer,
  type LandUseLayerModelParams
} from './LandUseLayer'
import {
  BORDER_LAYER,
  BRIDGE_LAYER,
  BUILDING_LAYER,
  CITY_FURNITURE_LAYER,
  EMERGENCY_ROUTE_LAYER,
  GENERIC_CITY_OBJECT_LAYER,
  HIGH_TIDE_RISK_LAYER,
  INLAND_FLOODING_RISK_LAYER,
  LAND_USE_LAYER,
  LANDMARK_LAYER,
  LANDSLIDE_LAYER,
  PARK_LAYER,
  PEDESTRIAN_LAYER,
  RAILWAY_LAYER,
  RIVER_FLOODING_RISK_LAYER,
  ROAD_LAYER,
  SHELTER_LAYER,
  STATION_LAYER,
  TSUNAMI_RISK_LAYER,
  URBAN_PLANNING_LAYER,
  USE_CASE_LAYER,
  VEGETATION_LAYER
} from './layerTypes'
import {
  createPedestrianLayer,
  type PedestrianLayerModelParams
} from './PedestrianLayer'
import {
  createRiverFloodingRiskLayer,
  type RiverFloodingRiskLayerModelParams
} from './RiverFloodingRiskLayer'
import { createRoadLayer, type RoadLayerModelParams } from './RoadLayer'
import {
  createUrbanPlanningLayer,
  type UrbanPlanningLayerModelParams
} from './UrbanPlanningLayer'

// prettier-ignore
type ViewLayerModelParams<T extends LayerType> =
  T extends typeof PEDESTRIAN_LAYER ? PedestrianLayerModelParams :
  // Dataset layers
  T extends typeof BORDER_LAYER ? never : // BorderLayerModelParams
  T extends typeof BRIDGE_LAYER ? BridgeLayerModelParams :
  T extends typeof BUILDING_LAYER ? BuildingLayerModelParams :
  T extends typeof CITY_FURNITURE_LAYER ? never : // CityFurnitureLayerModelParams
  T extends typeof EMERGENCY_ROUTE_LAYER ? never : // EmergencyRouteLayerModelParams
  T extends typeof GENERIC_CITY_OBJECT_LAYER ? never : // GenericLayerModelParams
  T extends typeof HIGH_TIDE_RISK_LAYER ? never : // HighTideRiskLayerModelParams
  T extends typeof INLAND_FLOODING_RISK_LAYER ? never : // InlandFloodingRiskLayerModelParams
  T extends typeof LAND_USE_LAYER ? LandUseLayerModelParams :
  T extends typeof LANDMARK_LAYER ? never : // LandmarkLayerModelParams
  T extends typeof LANDSLIDE_LAYER ? LandSlideRiskLayerModelParams :
  T extends typeof PARK_LAYER ? never : // ParkLayerModelParams
  T extends typeof RAILWAY_LAYER ? never : // RailwayLayerModelParams
  T extends typeof RIVER_FLOODING_RISK_LAYER ? RiverFloodingRiskLayerModelParams :
  T extends typeof ROAD_LAYER ? RoadLayerModelParams :
  T extends typeof SHELTER_LAYER ? never : // ShelterLayerModelParams
  T extends typeof STATION_LAYER ? never : // StationLayerModelParams
  T extends typeof TSUNAMI_RISK_LAYER ? never : // TsunamiRiskLayerModelParams
  T extends typeof URBAN_PLANNING_LAYER ? UrbanPlanningLayerModelParams :
  T extends typeof USE_CASE_LAYER ? never : // UseCaseLayerModelParams
  T extends typeof VEGETATION_LAYER ? never : // VegetationLayerModelParams
  never

export function createViewLayer<T extends LayerType>(
  params: ViewLayerModelParams<T> & { type: T }
): SetOptional<LayerModel<T>, 'id'>

// TODO: Refine types
export function createViewLayer<T extends LayerType>(
  params: ViewLayerModelParams<T> & { type: T }
): SetOptional<LayerModel, 'id'> | undefined {
  // prettier-ignore
  switch (params.type) {
    case PEDESTRIAN_LAYER: return createPedestrianLayer(params as PedestrianLayerModelParams)
    // Dataset layers
    case BORDER_LAYER: return undefined // createBorderLayer(params)
    case BRIDGE_LAYER: return createBridgeLayer(params as BridgeLayerModelParams)
    case BUILDING_LAYER: return createBuildingLayer(params as BuildingLayerModelParams)
    case CITY_FURNITURE_LAYER: return undefined // createCityFurnitureLayer(params)
    case EMERGENCY_ROUTE_LAYER: return undefined // createEmergencyRouteLayer(params)
    case GENERIC_CITY_OBJECT_LAYER: return undefined // createGenericCityObjectLayer(params)
    case HIGH_TIDE_RISK_LAYER: return undefined // createHighTideRiskLayer(params)
    case INLAND_FLOODING_RISK_LAYER: return undefined // createInlandFloodingRiskLayer(params)
    case LAND_USE_LAYER: return createLandUseLayer(params as LandUseLayerModelParams)
    case LANDMARK_LAYER: return undefined // createLandmarkLayer(params)
    case LANDSLIDE_LAYER: return createLandSlideRiskLayer(params as LandSlideRiskLayerModelParams)
    case PARK_LAYER: return undefined // createParkLayer(params)
    case RAILWAY_LAYER: return undefined // createRailwayLayer(params)
    case RIVER_FLOODING_RISK_LAYER: return createRiverFloodingRiskLayer(params as RiverFloodingRiskLayerModelParams)
    case ROAD_LAYER: return createRoadLayer(params as RoadLayerModelParams)
    case SHELTER_LAYER: return undefined // createShelterLayer(params)
    case STATION_LAYER: return undefined // createStationLayer(params)
    case TSUNAMI_RISK_LAYER: return undefined // createTsunamiRiskLayer(params)
    case URBAN_PLANNING_LAYER: return createUrbanPlanningLayer(params as UrbanPlanningLayerModelParams)
    case USE_CASE_LAYER: return undefined // createUseCaseLayer(params)
    case VEGETATION_LAYER: return undefined // createVegetationLayer(params)
  }
}
