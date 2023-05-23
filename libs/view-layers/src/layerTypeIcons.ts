import { type SvgIconProps } from '@mui/material'
import { type ComponentType } from 'react'

import { type LayerType } from '@takram/plateau-layers'
import { BuildingIcon, LayerIcon } from '@takram/plateau-ui-components/icons'

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

export const layerTypeIcons: Record<LayerType, ComponentType<SvgIconProps>> = {
  [BORDER_LAYER]: LayerIcon,
  [BRIDGE_LAYER]: LayerIcon,
  [BUILDING_LAYER]: BuildingIcon,
  [EMERGENCY_ROUTE_LAYER]: LayerIcon,
  [FACILITY_LAYER]: LayerIcon,
  [FLOOD_LAYER]: LayerIcon,
  [FURNITURE_LAYER]: LayerIcon,
  [GENERIC_LAYER]: LayerIcon,
  [HIGHTIDE_LAYER]: LayerIcon,
  [INLAND_FLOOD_LAYER]: LayerIcon,
  [LANDMARK_LAYER]: LayerIcon,
  [LANDSLIDE_LAYER]: LayerIcon,
  [LANDUSE_LAYER]: LayerIcon,
  [PARK_LAYER]: LayerIcon,
  [RAILWAY_LAYER]: LayerIcon,
  [ROAD_LAYER]: LayerIcon,
  [SHELTER_LAYER]: LayerIcon,
  [STATION_LAYER]: LayerIcon,
  [TSUNAMI_LAYER]: LayerIcon,
  [USE_CASE_LAYER]: LayerIcon,
  [VEGETATION_LAYER]: LayerIcon
}
