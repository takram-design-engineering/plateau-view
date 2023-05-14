import { type FeatureCollection } from 'geojson'
import { runCommands } from 'mapshaper'
import { mkdirp } from 'mkdirp'
import path from 'path'
import { read as readShapefile } from 'shapefile'
import invariant from 'tiny-invariant'

import { isNotNullish } from '@plateau/type-helpers'

interface Properties {
  municipalityCode: string
  municipalityName: string
  prefectureCode: string
  prefectureName: string
  area: number
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
        if (isNaN(+input.AREA)) {
          throw new Error('Cannot coarse area to number')
        }
        const properties: Properties = {
          municipalityCode: `${input.PREF}${input.CITY}`,
          municipalityName: input.CITY_NAME,
          prefectureCode: input.PREF,
          prefectureName: input.PREF_NAME,
          area: input.AREA
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
      '-dissolve fields=municipalityCode copy-fields=municipalityName,prefectureCode,prefectureName sum-fields=area',
      // Remove useless geometries.
      '-clean',
      `-o "${file}" format=topojson`
    ].join(' '),
    {
      'input.geojson': data
    }
  )
}

export async function main(): Promise<void> {
  const prefectureCodes = [...Array(47)].map((_, index) =>
    `${index + 1}`.padStart(2, '0')
  )
  await mkdirp(path.resolve('./data/municipalityPolygons'))
  for (const prefectureCode of prefectureCodes) {
    // Get the data at:
    // https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=B002005212020&prefCode=01&coordsys=1&format=shape&datum=2000
    const geojson = await convertToGeoJSON(
      path.resolve(
        `./data/estat/A002005212015DDSWC${prefectureCode}-JGD2011/h27ka${prefectureCode}`
      )
    )
    await writeTopoJSON(
      path.resolve('./data/municipalityPolygons', `${prefectureCode}.topojson`),
      geojson
    )
    console.log(`Saved ${prefectureCode}.topojson`)
  }
  console.log('Done')
}
