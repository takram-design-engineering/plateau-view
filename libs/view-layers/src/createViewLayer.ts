import { type SetOptional } from 'type-fest'

import {
  type LayerModel,
  type LayerModelOverrides,
  type LayerType
} from '@takram/plateau-layers'

import { createBridgeLayer, type BridgeLayerModelParams } from './BridgeLayer'
import {
  createBuildingLayer,
  type BuildingLayerModelParams
} from './BuildingLayer'
import {
  createLandslideLayer,
  type LandslideLayerModelParams
} from './LandslideLayer'
import {
  createLanduseLayer,
  type LanduseLayerModelParams
} from './LanduseLayer'
import { createRoadLayer, type RoadLayerModelParams } from './RoadLayer'
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

// prettier-ignore
type ViewLayerModelParams<T extends LayerType> =
  T extends typeof BORDER_LAYER ? never : // BorderLayerModelParams
  T extends typeof BRIDGE_LAYER ? BridgeLayerModelParams :
  T extends typeof BUILDING_LAYER ? BuildingLayerModelParams :
  T extends typeof EMERGENCY_ROUTE_LAYER ? never : // EmergencyRouteLayerModelParams
  T extends typeof FACILITY_LAYER ? never : // FacilityLayerModelParams
  T extends typeof FLOOD_LAYER ? never : // FloodLayerModelParams
  T extends typeof FURNITURE_LAYER ? never : // FurnitureLayerModelParams
  T extends typeof GENERIC_LAYER ? never : // GenericLayerModelParams
  T extends typeof HIGHTIDE_LAYER ? never : // HightideLayerModelParams
  T extends typeof INLAND_FLOOD_LAYER ? never : // InlandFloodLayerModelParams
  T extends typeof LANDMARK_LAYER ? never : // LandmarkLayerModelParams
  T extends typeof LANDSLIDE_LAYER ? LandslideLayerModelParams :
  T extends typeof LANDUSE_LAYER ? LanduseLayerModelParams :
  T extends typeof PARK_LAYER ? never : // ParkLayerModelParams
  T extends typeof RAILWAY_LAYER ? never : // RailwayLayerModelParams
  T extends typeof ROAD_LAYER ? RoadLayerModelParams :
  T extends typeof SHELTER_LAYER ? never : // ShelterLayerModelParams
  T extends typeof STATION_LAYER ? never : // StationLayerModelParams
  T extends typeof TSUNAMI_LAYER ? never : // TsunamiLayerModelParams
  T extends typeof USE_CASE_LAYER ? never : // UseCaseLayerModelParams
  T extends typeof VEGETATION_LAYER ? never : // VegetationLayerModelParams
  never

export function createViewLayer<T extends LayerType>(
  params: ViewLayerModelParams<T> & { type: T }
): SetOptional<LayerModelOverrides[T], 'id'>

export function createViewLayer<T extends LayerType>(
  params: ViewLayerModelParams<T> & { type: T }
): SetOptional<LayerModel, 'id'> | undefined {
  switch (params.type) {
    case BORDER_LAYER:
      return undefined // createBorderLayer(params)
    case BRIDGE_LAYER:
      return createBridgeLayer(params)
    case BUILDING_LAYER:
      return createBuildingLayer(params)
    case EMERGENCY_ROUTE_LAYER:
      return undefined // createEmergencyRouteLayer(params)
    case FACILITY_LAYER:
      return undefined // createFacilityLayer(params)
    case FLOOD_LAYER:
      return undefined // createFloodLayer(params)
    case FURNITURE_LAYER:
      return undefined // createFurnitureLayer(params)
    case GENERIC_LAYER:
      return undefined // createGenericLayer(params)
    case HIGHTIDE_LAYER:
      return undefined // createHightideLayer(params)
    case INLAND_FLOOD_LAYER:
      return undefined // createInlandFloodLayer(params)
    case LANDMARK_LAYER:
      return undefined // createLandmarkLayer(params)
    case LANDSLIDE_LAYER:
      return createLandslideLayer(params)
    case LANDUSE_LAYER:
      return createLanduseLayer(params)
    case PARK_LAYER:
      return undefined // createParkLayer(params)
    case RAILWAY_LAYER:
      return undefined // createRailwayLayer(params)
    case ROAD_LAYER:
      return createRoadLayer(params)
    case SHELTER_LAYER:
      return undefined // createShelterLayer(params)
    case STATION_LAYER:
      return undefined // createStationLayer(params)
    case TSUNAMI_LAYER:
      return undefined // createTsunamiLayer(params)
    case USE_CASE_LAYER:
      return undefined // createUseCaseLayer(params)
    case VEGETATION_LAYER:
      return undefined // createVegetationLayer(params)
  }
}
