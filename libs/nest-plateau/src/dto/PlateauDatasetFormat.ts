import { registerEnumType } from '@nestjs/graphql'

export enum PlateauDatasetFormatEnum {
  Cesium3DTiles = '3dtiles',
  CSV = 'csv',
  CZML = 'czml',
  GeoJson = 'geojson',
  GLTF = 'gltf',
  GTFS = 'gtfs',
  MVT = 'mvt',
  Tiles = 'tiles',
  TMS = 'tms',
  WMS = 'wms'
}

export type PlateauDatasetFormat = `${PlateauDatasetFormatEnum}`

registerEnumType(PlateauDatasetFormatEnum, {
  name: 'PlateauDatasetFormat'
})

export function cleanPlateauDatasetFormat(
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
