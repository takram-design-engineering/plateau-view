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
