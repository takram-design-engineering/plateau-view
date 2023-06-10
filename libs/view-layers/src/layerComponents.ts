import { type LayerComponents } from '@takram/plateau-layers'

import { BridgeLayer } from './BridgeLayer'
import { BuildingLayer } from './BuildingLayer'
import { LandSlideRiskLayer } from './LandSlideRiskLayer'
import { LandUseLayer } from './LandUseLayer'
import { PedestrianLayer } from './PedestrianLayer'
import { RiverFloodingRiskLayer } from './RiverFloodingRiskLayer'
import { RoadLayer } from './RoadLayer'
import { UrbanPlanningLayer } from './UrbanPlanningLayer'
import {
  BORDER_LAYER,
  BRIDGE_LAYER,
  BUILDING_LAYER,
  CITY_FURNITURE_LAYER,
  EMERGENCY_ROUTE_LAYER,
  GENERIC_CITY_OBJECT_LAYER,
  HIGH_TIDE_RISK_LAYER,
  INLAND_FLOODING_RISK_LAYER,
  LANDMARK_LAYER,
  LANDSLIDE_LAYER,
  LAND_USE_LAYER,
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

export const layerComponents: LayerComponents = {
  [PEDESTRIAN_LAYER]: PedestrianLayer,
  // Dataset layers
  [BORDER_LAYER]: undefined,
  [BRIDGE_LAYER]: BridgeLayer,
  [BUILDING_LAYER]: BuildingLayer,
  [CITY_FURNITURE_LAYER]: undefined,
  [EMERGENCY_ROUTE_LAYER]: undefined,
  [GENERIC_CITY_OBJECT_LAYER]: undefined,
  [HIGH_TIDE_RISK_LAYER]: undefined,
  [INLAND_FLOODING_RISK_LAYER]: undefined,
  [LAND_USE_LAYER]: LandUseLayer,
  [LANDMARK_LAYER]: undefined,
  [LANDSLIDE_LAYER]: LandSlideRiskLayer,
  [PARK_LAYER]: undefined,
  [RAILWAY_LAYER]: undefined,
  [RIVER_FLOODING_RISK_LAYER]: RiverFloodingRiskLayer,
  [ROAD_LAYER]: RoadLayer,
  [SHELTER_LAYER]: undefined,
  [STATION_LAYER]: undefined,
  [TSUNAMI_RISK_LAYER]: undefined,
  [URBAN_PLANNING_LAYER]: UrbanPlanningLayer,
  [USE_CASE_LAYER]: undefined,
  [VEGETATION_LAYER]: undefined
}
