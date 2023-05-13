export type PlateauDatasetVersion = '2020' | '2022'
export type PlateauDatasetFileType =
  | '3dtiles'
  | 'csv'
  | 'czml'
  | 'geojson'
  | 'gltf'
  | 'mvt'

export type PlateauDatasetFiles = Record<
  PlateauDatasetVersion,
  Record<PlateauDatasetFileType, string[]>
>
