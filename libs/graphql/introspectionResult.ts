export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    PlateauArea: ['PlateauMunicipality', 'PlateauPrefecture'],
    PlateauDataset: ['PlateauBuildingDataset', 'PlateauUnknownDataset']
  }
}
export default result
