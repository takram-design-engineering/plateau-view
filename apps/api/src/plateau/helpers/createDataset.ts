import { type Type } from '@nestjs/common'

import { PlateauBuildingDataset } from '../dto/PlateauBuildingDataset'
import { type PlateauCatalog } from '../dto/PlateauCatalog'
import { PlateauDatasetType, type PlateauDataset } from '../dto/PlateauDataset'
import { PlateauUnknownDataset } from '../dto/PlateauUnknownDataset'

const classes: Record<string, Type | undefined> = {
  [PlateauDatasetType.Border]: PlateauUnknownDataset,
  [PlateauDatasetType.Bridge]: PlateauUnknownDataset,
  [PlateauDatasetType.Building]: PlateauBuildingDataset,
  [PlateauDatasetType.EmergencyRoute]: PlateauUnknownDataset,
  [PlateauDatasetType.Facility]: PlateauUnknownDataset,
  [PlateauDatasetType.Flood]: PlateauUnknownDataset,
  [PlateauDatasetType.Furniture]: PlateauUnknownDataset,
  [PlateauDatasetType.Generic]: PlateauUnknownDataset,
  [PlateauDatasetType.Hightide]: PlateauUnknownDataset,
  [PlateauDatasetType.InlandFlood]: PlateauUnknownDataset,
  [PlateauDatasetType.Landmark]: PlateauUnknownDataset,
  [PlateauDatasetType.Landslide]: PlateauUnknownDataset,
  [PlateauDatasetType.Landuse]: PlateauUnknownDataset,
  [PlateauDatasetType.Park]: PlateauUnknownDataset,
  [PlateauDatasetType.Railway]: PlateauUnknownDataset,
  [PlateauDatasetType.Road]: PlateauUnknownDataset,
  [PlateauDatasetType.Shelter]: PlateauUnknownDataset,
  [PlateauDatasetType.Station]: PlateauUnknownDataset,
  [PlateauDatasetType.Tsunami]: PlateauUnknownDataset,
  [PlateauDatasetType.UseCase]: PlateauUnknownDataset,
  [PlateauDatasetType.Vegetation]: PlateauUnknownDataset
}

export function createDataset(
  catalog: PlateauCatalog
): PlateauDataset | undefined {
  const constructor = classes[catalog.data.type]
  return constructor != null ? new constructor(catalog) : undefined
}
