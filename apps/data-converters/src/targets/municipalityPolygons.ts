import { writeFile } from 'fs/promises'
import { type FeatureCollection } from 'geojson'
import { runCommands } from 'mapshaper'
import path from 'path'
import { read as readShapefile } from 'shapefile'
import invariant from 'tiny-invariant'

import { isNotNullish } from '@plateau/type-helpers'

interface Properties {
  municipalityCode: string
  municipalityName: string
  prefectureCode: string
  prefectureName: string
}

// Convert shapefile into GeoJSON, preprocessing geometries and properties.
async function convertToGeoJSON(file: string): Promise<FeatureCollection> {
  const collection = await readShapefile(`${file}.shp`, `${file}.dbf`, {
    encoding: 'sjis'
  })
  return {
    ...collection,
    features: collection.features
      .map(feature => {
        if (feature.properties == null) {
          return undefined
        }
        const input = feature.properties
        if (typeof input.CITY !== 'string' || typeof input.PREF !== 'string') {
          return undefined
        }
        const properties: Properties = {
          municipalityCode: `${input.PREF}${input.CITY}`,
          municipalityName: input.CITY_NAME,
          prefectureCode: input.PREF,
          prefectureName: input.PREF_NAME
        }
        invariant(feature.geometry.type === 'Polygon')
        return {
          ...feature,
          properties
        }
      })
      .filter(isNotNullish)
  }
}

// Convert GeoJSON to TopoJSON and write it, simplifying and merging geometries.
// Mapshaper is the best option to do so as far as I know.
async function writeTopoJSON(
  file: string,
  data: FeatureCollection,
  interval = 50
): Promise<void> {
  await runCommands(
    [
      '-i input.geojson name=root encoding=utf-8 snap',
      // Apply visvalingam simplification of the specified interval in meters.
      `-simplify interval=${interval}`,
      // Merge geometries of the same municipality code, copying properties of
      // the first geometry.
      '-dissolve fields=municipalityCode copy-fields=municipalityName,prefectureCode,prefectureName',
      // Remove useless geometries.
      '-clean',
      `-o "${file}" format=topojson`
    ].join(' '),
    {
      'input.geojson': data
    }
  )
}

// Get the data at:
// https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=B002005212020&prefCode=01&coordsys=1&format=shape&datum=2000
const sources = [...Array(47)].map((_, index) => {
  const code = `${index + 1}`.padStart(2, '0')
  return `estat/A002005212015DDSWC${code}-JGD2011/h27ka${code}`
})

export async function main(): Promise<void> {
  for (const source of sources) {
    const geojson = await convertToGeoJSON(path.resolve('./data', source))
    await writeFile(
      path.resolve('./data/estat', `${source}.geojson`),
      JSON.stringify(geojson)
    )
    await writeTopoJSON(
      path.resolve('./data/estat', `${source}.topojson`),
      geojson
    )
    console.log(`Processed ${source}.`)
  }
}
