import { type SvgIconProps } from '@mui/material'
import { type ComponentType } from 'react'

import { type LayerType } from '@takram/plateau-layers'
import {
  BorderIcon,
  BridgeIcon,
  BuildingIcon,
  CityFurnitureIcon,
  EmergencyRouteIcon,
  GenericCityObjectIcon,
  HighTideRiskIcon,
  InlandFloodingRiskIcon,
  LandmarkIcon,
  LandSlideRiskIcon,
  LandUseIcon,
  ParkIcon,
  PedestrianIcon,
  RailwayIcon,
  RiverFloodingRiskIcon,
  RoadIcon,
  ShelterIcon,
  StationIcon,
  TsunamiRiskIcon,
  UrbanPlanningIcon,
  UseCaseIcon,
  VegetationIcon
} from '@takram/plateau-ui-components/icons'

import {
  BORDER_LAYER,
  BRIDGE_LAYER,
  BUILDING_LAYER,
  CITY_FURNITURE_LAYER,
  EMERGENCY_ROUTE_LAYER,
  GENERIC_CITY_OBJECT_LAYER,
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
  STATION_LAYER,
  TSUNAMI_RISK_LAYER,
  URBAN_PLANNING_LAYER,
  USE_CASE_LAYER,
  VEGETATION_LAYER
} from './layerTypes'

export const layerTypeIcons: Record<LayerType, ComponentType<SvgIconProps>> = {
  [PEDESTRIAN_LAYER]: PedestrianIcon,
  // Dataset layers
  [BORDER_LAYER]: BorderIcon,
  [BRIDGE_LAYER]: BridgeIcon,
  [BUILDING_LAYER]: BuildingIcon,
  [CITY_FURNITURE_LAYER]: CityFurnitureIcon,
  [EMERGENCY_ROUTE_LAYER]: EmergencyRouteIcon,
  [GENERIC_CITY_OBJECT_LAYER]: GenericCityObjectIcon,
  [HIGH_TIDE_RISK_LAYER]: HighTideRiskIcon,
  [INLAND_FLOODING_RISK_LAYER]: InlandFloodingRiskIcon,
  [LAND_USE_LAYER]: LandUseIcon,
  [LANDMARK_LAYER]: LandmarkIcon,
  [LAND_SLIDE_RISK_LAYER]: LandSlideRiskIcon,
  [PARK_LAYER]: ParkIcon,
  [RAILWAY_LAYER]: RailwayIcon,
  [RIVER_FLOODING_RISK_LAYER]: RiverFloodingRiskIcon,
  [ROAD_LAYER]: RoadIcon,
  [SHELTER_LAYER]: ShelterIcon,
  [STATION_LAYER]: StationIcon,
  [TSUNAMI_RISK_LAYER]: TsunamiRiskIcon,
  [URBAN_PLANNING_LAYER]: UrbanPlanningIcon,
  [USE_CASE_LAYER]: UseCaseIcon,
  [VEGETATION_LAYER]: VegetationIcon
}
