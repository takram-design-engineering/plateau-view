import { readFile, writeFile } from 'fs/promises'
import { fromPairs, isArray, sumBy } from 'lodash'
import path from 'path'
import invariant from 'tiny-invariant'
import type TopoJSON from 'topojson-specification'

import { isNotNullish } from '@plateau/type-helpers'

import { type MunicipalityGeometry } from './municipalityPolygons'

export type Prefectures = Record<
  string, // code
  string // name
>

export type Municipalities = Record<
  string, // code
  | [string, number] // [name, area]
  | [string, number, string[]] // [name, area, childCodes]
  | [string, number, string] // [name, area, parentCode]
>

function compareMunicipalityCode(
  municipalityCode: string,
  geometry: MunicipalityGeometry
): boolean {
  invariant(geometry.properties != null)
  return geometry.properties.municipalityCode === municipalityCode
}

// Get the data at: https://www.e-stat.go.jp/municipalities/cities/areacode
const source = path.resolve('./data/estat/FEA_hyoujun-20230507084049.csv')

function addChild(
  childCode: string,
  parentCode: string,
  record: Municipalities
): void {
  const parent = record[parentCode]
  invariant(parent != null)
  if (parent.length === 2) {
    record[parentCode] = [...parent, [childCode]]
  } else {
    invariant(isArray(parent[2]))
    parent[2].push(childCode)
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
        // the special wards.
        if (municipalityCode === '13100') {
          return [municipalityCode, ['東京23区', 0]]
        }
        if (/^131\d{2}$/.test(municipalityCode)) {
          return [municipalityCode, [municipalityName, 0, '13100']]
        }
        if (cityName.endsWith('市') && municipalityName !== '') {
          const parentCode = designatedCityCodes[cityName]
          invariant(parentCode != null)
          return [municipalityCode, [municipalityName, 0, parentCode]]
        }
        return [
          municipalityCode,
          [municipalityName === '' ? cityName : municipalityName, 0]
        ]
      }
    )
  )

  // Populate child codes of designated cities and the special wards.
  Object.entries(municipalities)
    .filter(
      // Municipality with parent code
      (entry): entry is [string, [string, number, string]] =>
        entry[1].length === 3
    )
    .forEach(([municipalityCode, [, , parentCode]]) => {
      addChild(municipalityCode, parentCode, municipalities)
    })

  const topologies: Record<
    string,
    TopoJSON.Topology<{
      root: {
        type: 'GeometryCollection'
        geometries: MunicipalityGeometry[]
      }
    }>
  > = fromPairs(
    await Promise.all(
      [...Array(47)].map(async (_, index) => {
        const prefectureCode = `${index + 1}`.padStart(2, '0')
        return [
          prefectureCode,
          JSON.parse(
            await readFile(
              `./data/municipalityPolygons/${prefectureCode}.topojson`,
              'utf-8'
            )
          )
        ]
      })
    )
  )

  // Compute the area of municipalities.
  for (const [municipalityCode, value] of Object.entries(municipalities)) {
    const prefectureCode = municipalityCode.slice(0, 2)
    const topology = topologies[prefectureCode]
    const geometries = topology.objects.root.geometries

    let area: number
    if (Array.isArray(value[2])) {
      // This municipality is designated city or special wards.
      const wards = value[2]
        .map(wardCode =>
          geometries.find(geometry =>
            compareMunicipalityCode(wardCode, geometry)
          )
        )
        .filter(isNotNullish)
      invariant(wards.length > 0)
      area = sumBy(wards, ward => ward.properties?.area ?? 0)
    } else {
      const found = geometries.find(geometry =>
        compareMunicipalityCode(municipalityCode, geometry)
      )
      // Some municipalities don't have polygons. Denote it by zero.
      area = found?.properties?.area ?? 0
    }
    value[1] = Math.round(area) // In squared meter precision
  }

  const output = {
    prefectures,
    municipalities
  }
  await writeFile(
    path.resolve('./data/municipalityCodes.json'),
    JSON.stringify(output)
  )
  console.log('Done')
}
