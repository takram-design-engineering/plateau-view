import { readFile, writeFile } from 'fs/promises'
import { fromPairs } from 'lodash'
import path from 'path'
import invariant from 'tiny-invariant'
import type TopoJSON from 'topojson-specification'

import { isNotNullish } from '@plateau/type-helpers'

import { type Municipalities, type Prefectures } from './areaCodes'
import { type AreaGeometry } from './areaPolygons'

export async function main(): Promise<void> {
  const { prefectures, municipalities } = JSON.parse(
    await readFile(
      path.resolve('./libs/geocoder/src/assets/areaCodes.json'),
      'utf-8'
    )
  ) as {
    prefectures: Prefectures
    municipalities: Municipalities
  }

  const topologies: Record<
    string,
    TopoJSON.Topology<{
      root: {
        type: 'GeometryCollection'
        geometries: AreaGeometry[]
      }
    }>
  > = fromPairs(
    await Promise.all(
      Object.keys(prefectures).map(async prefectureCode => [
        prefectureCode,
        JSON.parse(
          await readFile(
            `./apps/app/public/assets/areaPolygons/${prefectureCode}.topojson`,
            'utf-8'
          )
        )
      ])
    )
  )

  const output: Record<string, number> = fromPairs([
    ...Object.keys(prefectures)
      .map(prefectureCode => {
        const topology = topologies[prefectureCode]
        const geometries = topology.objects.root.geometries
        const geometry = geometries.find(
          geometry =>
            geometry.properties?.prefectureCode === prefectureCode &&
            geometry.properties.municipalityCode == null
        )
        if (geometry == null) {
          return undefined // Some municipalities don't have polygons.
        }
        invariant(geometry.properties != null)
        return [prefectureCode, geometry.properties.radius]
      })
      .filter(isNotNullish),
    ...Object.keys(municipalities)
      .map(municipalityCode => {
        const prefectureCode = municipalityCode.slice(0, 2)
        const topology = topologies[prefectureCode]
        const geometries = topology.objects.root.geometries
        const geometry = geometries.find(
          geometry => geometry.properties?.municipalityCode === municipalityCode
        )
        if (geometry == null) {
          return undefined // Some municipalities don't have polygons.
        }
        invariant(geometry.properties != null)
        return [municipalityCode, geometry.properties.radius]
      })
      .filter(isNotNullish)
  ])

  await writeFile(
    path.resolve('./libs/geocoder/src/assets/areaRadii.json'),
    JSON.stringify(output)
  )
  console.log('Done')
}
