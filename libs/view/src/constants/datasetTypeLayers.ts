/* eslint-disable @typescript-eslint/no-unused-vars */

import { PlateauDatasetType } from '@takram/plateau-graphql'
import { type LayerType } from '@takram/plateau-layers'
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
  RAILWAY_LAYER,
  RIVER_FLOODING_RISK_LAYER,
  ROAD_LAYER,
  SHELTER_LAYER,
  STATION_LAYER,
  TSUNAMI_RISK_LAYER,
  URBAN_PLANNING_LAYER,
  USE_CASE_LAYER,
  VEGETATION_LAYER
} from '@takram/plateau-view-layers'

export const datasetTypeLayers = {
  [PlateauDatasetType.Border]: undefined, // BORDER_LAYER
  [PlateauDatasetType.Bridge]: BRIDGE_LAYER,
  [PlateauDatasetType.Building]: BUILDING_LAYER,
  [PlateauDatasetType.EmergencyRoute]: undefined, // EMERGENCY_ROUTE_LAYER
  [PlateauDatasetType.UrbanPlanning]: URBAN_PLANNING_LAYER,
  [PlateauDatasetType.RiverFloodingRisk]: RIVER_FLOODING_RISK_LAYER,
  [PlateauDatasetType.CityFurniture]: undefined, // CITY_FURNITURE_LAYER
  [PlateauDatasetType.GenericCityObject]: undefined, // GENERIC_CITY_OBJECT_LAYER
  [PlateauDatasetType.HighTideRisk]: undefined, // HIGH_TIDE_RISK_LAYER
  [PlateauDatasetType.InlandFloodingRisk]: undefined, // INLAND_FLOODING_RISK_LAYER
  [PlateauDatasetType.Landmark]: undefined, // LANDMARK_LAYER
  [PlateauDatasetType.LandSlideRisk]: LAND_SLIDE_RISK_LAYER,
  [PlateauDatasetType.LandUse]: LAND_USE_LAYER,
  [PlateauDatasetType.Park]: undefined, // PARK_LAYER
  [PlateauDatasetType.Railway]: undefined, // RAILWAY_LAYER
  [PlateauDatasetType.Road]: ROAD_LAYER,
  [PlateauDatasetType.Shelter]: undefined, // SHELTER_LAYER
  [PlateauDatasetType.Station]: undefined, // STATION_LAYER
  [PlateauDatasetType.TsunamiRisk]: undefined, // TSUNAMI_RISK_LAYER
  [PlateauDatasetType.UseCase]: undefined, // USE_CASE_LAYER
  [PlateauDatasetType.Vegetation]: undefined // VEGETATION_LAYER
} as const satisfies Record<PlateauDatasetType, LayerType | undefined>
