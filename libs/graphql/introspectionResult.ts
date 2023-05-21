export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    PlateauArea: ['PlateauMunicipality', 'PlateauPrefecture'],
    PlateauDataset: ['PlateauBuildingDataset', 'PlateauDefaultDataset'],
    PlateauDatasetDatum: [
      'PlateauBuildingDatasetDatum',
      'PlateauDefaultDatasetDatum'
    ]
  }
}
export default result
