/* eslint-disable @typescript-eslint/no-unused-vars */

import { PlateauDatasetType } from '@takram/plateau-graphql'
import { type LayerType } from '@takram/plateau-layers'
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
} from '@takram/plateau-view-layers'

export const datasetTypeLayers: Record<
  PlateauDatasetType,
  LayerType | undefined
> = {
  [PlateauDatasetType.Border]: undefined, // BORDER_LAYER
  [PlateauDatasetType.Bridge]: BRIDGE_LAYER,
  [PlateauDatasetType.Building]: BUILDING_LAYER,
  [PlateauDatasetType.EmergencyRoute]: undefined, // EMERGENCY_ROUTE_LAYER
  [PlateauDatasetType.Facility]: undefined, // FACILITY_LAYER
  [PlateauDatasetType.Flood]: undefined, // FLOOD_LAYER
  [PlateauDatasetType.Furniture]: undefined, // FURNITURE_LAYER
  [PlateauDatasetType.Generic]: undefined, // GENERIC_LAYER
  [PlateauDatasetType.Hightide]: undefined, // HIGHTIDE_LAYER
  [PlateauDatasetType.InlandFlood]: undefined, // INLAND_FLOOD_LAYER
  [PlateauDatasetType.Landmark]: undefined, // LANDMARK_LAYER
  [PlateauDatasetType.Landslide]: LANDSLIDE_LAYER,
  [PlateauDatasetType.Landuse]: LANDUSE_LAYER,
  [PlateauDatasetType.Park]: undefined, // PARK_LAYER
  [PlateauDatasetType.Railway]: undefined, // RAILWAY_LAYER
  [PlateauDatasetType.Road]: ROAD_LAYER,
  [PlateauDatasetType.Shelter]: undefined, // SHELTER_LAYER
  [PlateauDatasetType.Station]: undefined, // STATION_LAYER
  [PlateauDatasetType.Tsunami]: undefined, // TSUNAMI_LAYER
  [PlateauDatasetType.UseCase]: undefined, // USE_CASE_LAYER
  [PlateauDatasetType.Vegetation]: undefined // VEGETATION_LAYER
}
