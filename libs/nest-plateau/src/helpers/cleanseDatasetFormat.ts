import { type PlateauDatasetFormat } from '../dto/PlateauDatasetFormat'

export function cleanseDatasetFormat(
  value: string
): PlateauDatasetFormat | undefined {
  const cleansed = value.replace(/\s/g, '').toLowerCase()
  return cleansed === '3dtiles' ||
    cleansed === 'csv' ||
    cleansed === 'czml' ||
    cleansed === 'geojson' ||
    cleansed === 'gltf' ||
    cleansed === 'gtfs' ||
    cleansed === 'mvt' ||
    cleansed === 'tiles' ||
    cleansed === 'tms' ||
    cleansed === 'wms'
    ? cleansed
    : undefined
}
