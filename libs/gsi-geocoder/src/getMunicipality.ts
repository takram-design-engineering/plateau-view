interface Definition {
  prefectures: Record<string, string | undefined>
  municipalities: Record<string, string | undefined>
}

export interface Municipality {
  prefectureCode: string
  prefectureName: string
  municipalityCode: string
  municipalityName: string
}

let promise: Promise<Definition>

export async function getMunicipality(
  code: string
): Promise<Municipality | undefined> {
  const data = await (promise ??
    (promise = import('./assets/municipalities.json')))

  const prefectureCode = code.slice(0, 2)
  const prefectureName = data.prefectures[prefectureCode]
  const municipalityName = data.municipalities[code]
  return prefectureName != null && municipalityName != null
    ? {
        prefectureCode,
        prefectureName,
        municipalityCode: code,
        municipalityName
      }
    : undefined
}
