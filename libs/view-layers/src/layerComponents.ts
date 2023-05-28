import { type FC } from 'react'

import {
  type LayerComponents,
  type LayerProps,
  type LayerType
} from '@takram/plateau-layers'

import { BridgeLayer } from './BridgeLayer'
import { BuildingLayer } from './BuildingLayer'
import { LandSlideRiskLayer } from './LandSlideRiskLayer'
import { LandUseLayer } from './LandUseLayer'
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

// TODO: Remove this when all the layers are implemented.
const NullLayer: FC<LayerProps<LayerType>> = () => null

export const layerComponents = {
  [BORDER_LAYER]: NullLayer,
  [BRIDGE_LAYER]: BridgeLayer,
  [BUILDING_LAYER]: BuildingLayer,
  [CITY_FURNITURE_LAYER]: NullLayer,
  [EMERGENCY_ROUTE_LAYER]: NullLayer,
  [GENERIC_CITY_OBJECT_LAYER]: NullLayer,
  [HIGH_TIDE_RISK_LAYER]: NullLayer,
  [INLAND_FLOODING_RISK_LAYER]: NullLayer,
  [LAND_USE_LAYER]: LandUseLayer,
  [LANDMARK_LAYER]: NullLayer,
  [LANDSLIDE_LAYER]: LandSlideRiskLayer,
  [PARK_LAYER]: NullLayer,
  [RAILWAY_LAYER]: NullLayer,
  [RIVER_FLOODING_RISK_LAYER]: RiverFloodingRiskLayer,
  [ROAD_LAYER]: RoadLayer,
  [SHELTER_LAYER]: NullLayer,
  [STATION_LAYER]: NullLayer,
  [TSUNAMI_RISK_LAYER]: NullLayer,
  [URBAN_PLANNING_LAYER]: UrbanPlanningLayer,
  [USE_CASE_LAYER]: NullLayer,
  [VEGETATION_LAYER]: NullLayer
} as unknown as LayerComponents // TODO: Refine type
