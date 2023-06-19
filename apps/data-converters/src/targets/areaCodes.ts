import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fromPairs, isArray } from 'lodash'
import invariant from 'tiny-invariant'

export type Prefectures = Record<
  string, // code
  string // name
>

export type Municipalities = Record<
  string, // code
  | string // name
  | [string, string[]] // [name, childCodes]
  | [string, string] // [name, parentCode]
>

// Get the data at: https://www.e-stat.go.jp/municipalities/cities/areacode
const source = path.resolve('./data/estat/FEA_hyoujun-20230507084049.csv')

function addChild(
  childCode: string,
  parentCode: string,
  record: Municipalities
): void {
  const parent = record[parentCode]
  invariant(parent != null)
  if (typeof parent === 'string') {
    record[parentCode] = [parent, [childCode]]
  } else {
    invariant(isArray(parent[1]))
    parent[1].push(childCode)
  }
}

export async function main(): Promise<void> {
  const { csvParseRows } = await import('d3')

  const designatedCityCodes: Record<string, string> = {}
  const prefectures: Prefectures = {}
  const municipalities: Municipalities = fromPairs(
    csvParseRows(
      await readFile(source, 'utf-8'),
      (
        [municipalityCode, prefectureName, cityName, , municipalityName],
        index
      ) => {
        if (index === 0) {
          return
        }
        const prefectureCode = municipalityCode.slice(0, 2)
        if (prefectures[prefectureName] == null) {
          prefectures[prefectureCode] = prefectureName
        }

        // Remember designated cities.
        if (cityName.endsWith('市') && municipalityName === '') {
          designatedCityCodes[cityName] = municipalityCode
        }
        // Append the parent code for designated city wards, with exception of
        // Tokyo 23 wards.
        if (municipalityCode === '13100') {
          return [municipalityCode, '東京都23区']
        }
        if (/^131\d{2}$/.test(municipalityCode)) {
          return [municipalityCode, [municipalityName, '13100']]
        }
        if (cityName.endsWith('市') && municipalityName !== '') {
          const parentCode = designatedCityCodes[cityName]
          invariant(parentCode != null)
          return [municipalityCode, [municipalityName, parentCode]]
        }
        return [
          municipalityCode,
          municipalityName === '' ? cityName : municipalityName
        ]
      }
    )
  )

  Object.entries(municipalities)
    .filter((entry): entry is [string, [string, string]] =>
      Array.isArray(entry[1])
    )
    .forEach(([municipalityCode, [, parentCode]]) => {
      addChild(municipalityCode, parentCode, municipalities)
    })

  const output = {
    prefectures,
    municipalities
  }
  await writeFile(
    path.resolve('./libs/geocoder/src/assets/areaCodes.json'),
    JSON.stringify(output)
  )
  console.log('Done')
}
