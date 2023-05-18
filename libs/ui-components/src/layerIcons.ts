import { type SvgIconProps } from '@mui/material'
import { type ComponentType } from 'react'

import { type LayerType } from '@plateau/layers'
import { BUILDING_LAYER } from '@plateau/view-layers'

import { BuildingIcon } from './icons'

export const layerIcons: Record<LayerType, ComponentType<SvgIconProps>> = {
  // [BORDER_LAYER]: BorderIcon,
  // [BRIDGE_LAYER]: BridgeIcon,
  [BUILDING_LAYER]: BuildingIcon
  // [EMERGENCY_ROUTE_LAYER]: EmergencyRouteIcon,
  // [FACILITY_LAYER]: FacilityIcon,
  // [FLOOD_LAYER]: FloodIcon,
  // [FURNITURE_LAYER]: FurnitureIcon,
  // [GENERIC_LAYER]: GenericIcon,
  // [HIGHTIDE_LAYER]: HightideIcon,
  // [INLAND_FLOOD_LAYER]: InlandFloodIcon,
  // [LANDMARK_LAYER]: LandmarkIcon,
  // [LANDSLIDE_LAYER]: LandslideIcon,
  // [LANDUSE_LAYER]: LanduseIcon,
  // [PARK_LAYER]: ParkIcon,
  // [RAILWAY_LAYER]: RailwayIcon,
  // [ROAD_LAYER]: RoadIcon,
  // [SHELTER_LAYER]: ShelterIcon,
  // [STATION_LAYER]: StationIcon,
  // [TSUNAMI_LAYER]: TsunamiIcon,
  // [USE_CASE_LAYER]: UseCaseIcon,
  // [VEGETATION_LAYER]: VegetationIcon
}
