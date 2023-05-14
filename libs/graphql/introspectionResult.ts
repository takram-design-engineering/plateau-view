export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    PlateauArea: ['PlateauMunicipality', 'PlateauPrefecture'],
    PlateauDataset: ['PlateauBuildingDataset', 'PlateauDefaultDataset'],
    PlateauDatasetVariant: [
      'PlateauBuildingDatasetVariant',
      'PlateauDefaultDatasetVariant'
    ]
  }
}
export default result
