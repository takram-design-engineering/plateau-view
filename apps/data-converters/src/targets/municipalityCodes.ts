import { readFile, writeFile } from 'fs/promises'
import { fromPairs } from 'lodash'
import path from 'path'

import { isNotFalse } from '@plateau/type-helpers'

// Get the data at: https://www.e-stat.go.jp/municipalities/cities/areacode
const source = 'estat/FEA_hyoujun-20230507084049.csv'

export async function main(): Promise<void> {
  const { csvParseRows } = await import('d3')
  const prefectures: Record<string, string> = {}
  const municipalities = csvParseRows(
    await readFile(path.resolve('./data', source), 'utf-8'),
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
      return [
        municipalityCode,
        [
          cityName.endsWith('市') && cityName,
          municipalityName !== '' && municipalityName
        ]
          .filter(isNotFalse)
          .join(' ')
      ]
    }
  )

  const output = {
    prefectures,
    municipalities: fromPairs(municipalities)
  }
  await writeFile(
    path.resolve('./data/municipalities.json'),
    JSON.stringify(output)
  )
  console.log('Done')
}
