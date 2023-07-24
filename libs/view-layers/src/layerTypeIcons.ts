import { type SvgIconProps } from '@mui/material'
import { type ComponentType } from 'react'

import { type LayerType } from '@takram/plateau-layers'
import {
  BuildingIcon,
  LayerIcon,
  PedestrianIcon
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
  [BORDER_LAYER]: LayerIcon,
  [BRIDGE_LAYER]: LayerIcon,
  [BUILDING_LAYER]: BuildingIcon,
  [CITY_FURNITURE_LAYER]: LayerIcon,
  [EMERGENCY_ROUTE_LAYER]: LayerIcon,
  [GENERIC_CITY_OBJECT_LAYER]: LayerIcon,
  [HIGH_TIDE_RISK_LAYER]: LayerIcon,
  [INLAND_FLOODING_RISK_LAYER]: LayerIcon,
  [LAND_USE_LAYER]: LayerIcon,
  [LANDMARK_LAYER]: LayerIcon,
  [LAND_SLIDE_RISK_LAYER]: LayerIcon,
  [PARK_LAYER]: LayerIcon,
  [RAILWAY_LAYER]: LayerIcon,
  [RIVER_FLOODING_RISK_LAYER]: LayerIcon,
  [ROAD_LAYER]: LayerIcon,
  [SHELTER_LAYER]: LayerIcon,
  [STATION_LAYER]: LayerIcon,
  [TSUNAMI_RISK_LAYER]: LayerIcon,
  [URBAN_PLANNING_LAYER]: LayerIcon,
  [USE_CASE_LAYER]: LayerIcon,
  [VEGETATION_LAYER]: LayerIcon
}
