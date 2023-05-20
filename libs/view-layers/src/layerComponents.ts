import { type PrimitiveAtom } from 'jotai'
import { type FC } from 'react'

import {
  type LayerComponents,
  type LayerProps,
  type LayerType
} from '@plateau/layers'

import { BRIDGE_LAYER, BridgeLayer, type BridgeLayerModel } from './BridgeLayer'
import {
  BUILDING_LAYER,
  BuildingLayer,
  type BuildingLayerModel
} from './BuildingLayer'
import {
  LANDSLIDE_LAYER,
  LandslideLayer,
  type LandslideLayerModel
} from './LandslideLayer'
import {
  LANDUSE_LAYER,
  LanduseLayer,
  type LanduseLayerModel
} from './LanduseLayer'
import { ROAD_LAYER, RoadLayer, type RoadLayerModel } from './RoadLayer'

// TODO: Remove these after all the layers are implemented.
export const BORDER_LAYER = 'BORDER_LAYER'
export const EMERGENCY_ROUTE_LAYER = 'EMERGENCY_ROUTE_LAYER'
export const FACILITY_LAYER = 'FACILITY_LAYER'
export const FLOOD_LAYER = 'FLOOD_LAYER'
export const FURNITURE_LAYER = 'FURNITURE_LAYER'
export const GENERIC_LAYER = 'GENERIC_LAYER'
export const HIGHTIDE_LAYER = 'HIGHTIDE_LAYER'
export const INLAND_FLOOD_LAYER = 'INLAND_FLOOD_LAYER'
export const LANDMARK_LAYER = 'LANDMARK_LAYER'
export const PARK_LAYER = 'PARK_LAYER'
export const RAILWAY_LAYER = 'RAILWAY_LAYER'
export const SHELTER_LAYER = 'SHELTER_LAYER'
export const STATION_LAYER = 'STATION_LAYER'
export const TSUNAMI_LAYER = 'TSUNAMI_LAYER'
export const USE_CASE_LAYER = 'USE_CASE_LAYER'
export const VEGETATION_LAYER = 'VEGETATION_LAYER'

declare module '@plateau/layers' {
  interface LayerModel {
    municipalityCode: string
    titleAtom: PrimitiveAtom<string | null>
    loadingAtom: PrimitiveAtom<boolean>
    hiddenAtom: PrimitiveAtom<boolean>
    selectedAtom: PrimitiveAtom<boolean>
  }

  interface LayerModelOverrides {
    [BORDER_LAYER]: LayerModel
    [BRIDGE_LAYER]: BridgeLayerModel
    [BUILDING_LAYER]: BuildingLayerModel
    [EMERGENCY_ROUTE_LAYER]: LayerModel
    [FACILITY_LAYER]: LayerModel
    [FLOOD_LAYER]: LayerModel
    [FURNITURE_LAYER]: LayerModel
    [GENERIC_LAYER]: LayerModel
    [HIGHTIDE_LAYER]: LayerModel
    [INLAND_FLOOD_LAYER]: LayerModel
    [LANDMARK_LAYER]: LayerModel
    [LANDSLIDE_LAYER]: LandslideLayerModel
    [LANDUSE_LAYER]: LanduseLayerModel
    [PARK_LAYER]: LayerModel
    [RAILWAY_LAYER]: LayerModel
    [ROAD_LAYER]: RoadLayerModel
    [SHELTER_LAYER]: LayerModel
    [STATION_LAYER]: LayerModel
    [TSUNAMI_LAYER]: LayerModel
    [USE_CASE_LAYER]: LayerModel
    [VEGETATION_LAYER]: LayerModel
  }
}

// TODO: Remove this after all the layers are implemented.
const NullLayer: FC<LayerProps<LayerType>> = () => null

export const layerComponents = {
  [BORDER_LAYER]: NullLayer,
  [BRIDGE_LAYER]: BridgeLayer,
  [BUILDING_LAYER]: BuildingLayer,
  [EMERGENCY_ROUTE_LAYER]: NullLayer,
  [FACILITY_LAYER]: NullLayer,
  [FLOOD_LAYER]: NullLayer,
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
