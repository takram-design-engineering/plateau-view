import { type FC } from 'react'

import {
  type LayerComponents,
  type LayerProps,
  type LayerType
} from '@takram/plateau-layers'

import { BridgeLayer } from './BridgeLayer'
import { BuildingLayer } from './BuildingLayer'
import { FacilityLayer } from './FacilityLayer'
import { FloodLayer } from './FloodLayer'
import { LandslideLayer } from './LandslideLayer'
import { LanduseLayer } from './LanduseLayer'
import { RoadLayer } from './RoadLayer'
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

// TODO: Remove this when all the layers are implemented.
const NullLayer: FC<LayerProps<LayerType>> = () => null

export const layerComponents = {
  [BORDER_LAYER]: NullLayer,
  [BRIDGE_LAYER]: BridgeLayer,
  [BUILDING_LAYER]: BuildingLayer,
  [EMERGENCY_ROUTE_LAYER]: NullLayer,
  [FACILITY_LAYER]: FacilityLayer,
  [FLOOD_LAYER]: FloodLayer,
  [FURNITURE_LAYER]: NullLayer,
  [GENERIC_LAYER]: NullLayer,
  [HIGHTIDE_LAYER]: NullLayer,
  [INLAND_FLOOD_LAYER]: NullLayer,
  [LANDMARK_LAYER]: NullLayer,
  [LANDSLIDE_LAYER]: LandslideLayer,
  [LANDUSE_LAYER]: LanduseLayer,
  [PARK_LAYER]: NullLayer,
  [RAILWAY_LAYER]: NullLayer,
  [ROAD_LAYER]: RoadLayer,
  [SHELTER_LAYER]: NullLayer,
  [STATION_LAYER]: NullLayer,
  [TSUNAMI_LAYER]: NullLayer,
  [USE_CASE_LAYER]: NullLayer,
  [VEGETATION_LAYER]: NullLayer
} as unknown as LayerComponents // TODO: Refine type
