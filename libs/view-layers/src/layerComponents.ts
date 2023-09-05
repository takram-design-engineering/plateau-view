import { type LayerComponents } from '@takram/plateau-layers'

import { BridgeLayer } from './BridgeLayer'
import { BuildingLayer } from './BuildingLayer'
import { HeatmapLayer } from './HeatmapLayer'
import { LandSlideRiskLayer } from './LandSlideRiskLayer'
import { LandUseLayer } from './LandUseLayer'
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
import { PedestrianLayer } from './PedestrianLayer'
import { RiverFloodingRiskLayer } from './RiverFloodingRiskLayer'
import { RoadLayer } from './RoadLayer'
import { SketchLayer } from './SketchLayer'
import { UrbanPlanningLayer } from './UrbanPlanningLayer'

export const layerComponents: LayerComponents = {
  [HEATMAP_LAYER]: HeatmapLayer,
  [PEDESTRIAN_LAYER]: PedestrianLayer,
  [SKETCH_LAYER]: SketchLayer,

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
  [LAND_SLIDE_RISK_LAYER]: LandSlideRiskLayer,
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
