import { type PlateauCatalog } from '../dto/PlateauCatalog'

export function cleanseDatasetName(
  name: string,
  catalog: PlateauCatalog
): string {
  const municipalityName =
    'ward_code' in catalog.data
      ? catalog.data.ward ?? catalog.data.city
      : catalog.data.city

  // Remove redundant texts in the name.
  const result = name
    .replace(new RegExp(`${catalog.data.type}\\s*`), '')
    .replace('モデル', '') // TODO: Address false negatives
  if (municipalityName == null) {
    return result
  }
  return result.replace(`（${municipalityName}）`, '')
}
