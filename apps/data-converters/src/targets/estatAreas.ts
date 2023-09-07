import path from 'path'
import { Firestore, type CollectionReference } from '@google-cloud/firestore'
import * as turf from '@turf/turf'
import { geohashForLocation } from 'geofire-common'
import {
  type FeatureCollection,
  type MultiPolygon,
  type Polygon
} from 'geojson'
import { mapValues } from 'lodash'
import { applyCommands } from 'mapshaper'
import moji from 'moji'
import { read as readShapefile } from 'shapefile'
import invariant from 'tiny-invariant'
import { feature } from 'topojson-client'
import type TopoJSON from 'topojson-specification'

import { type EstatAreaDocumentProperties } from '@takram/plateau-nest-estat-areas'
import { isNotNullish } from '@takram/plateau-type-helpers'

type Topology = TopoJSON.Topology<{
  root: {
    type: 'GeometryCollection'
    geometries: Array<
      | TopoJSON.Polygon<EstatAreaDocumentProperties>
      | TopoJSON.MultiPolygon<EstatAreaDocumentProperties>
    >
  }
}>

function cleanseName(text: string): string {
  return moji(text)
    .convert('ZE', 'HE')
    .convert('ZS', 'HS')
    .convert('HK', 'ZK')
    .toString()
    .replaceAll('，', '、')
}

// Preprocess geometries and properties.
async function processGeoJSON(
  collection: FeatureCollection
): Promise<FeatureCollection> {
  return {
    ...collection,
    features: collection.features
      .map(feature => {
        if (feature.properties == null) {
          return undefined
        }
        const input = feature.properties
        if (
          typeof input.KEY_CODE !== 'string' ||
          typeof input.PREF !== 'string' ||
          typeof input.CITY !== 'string' ||
          typeof input.PREF_NAME !== 'string' ||
          typeof input.CITY_NAME !== 'string' ||
          typeof input.S_NAME !== 'string'
        ) {
          return undefined
        }
        invariant(feature.geometry.type === 'Polygon')
        return {
          ...feature,
          properties: mapValues(feature.properties, value =>
            typeof value === 'string' ? cleanseName(value) : value
          )
        }
      })
      .filter(isNotNullish)
  }
}

// Convert GeoJSON to TopoJSON, simplifying and merging geometries. Mapshaper is
// the best option to do so as far as I know.
async function convertToTopoJSON(params: {
  collection: FeatureCollection
  interval?: number
}): Promise<Topology> {
  const result = await applyCommands(
    [
      '-i input.geojson name=root encoding=utf-8 snap',
      // Apply visvalingam simplification of the specified interval in meters.
      `-simplify interval=${params.interval ?? 10}`,
      // Remove useless geometries.
      '-clean',
      `-o "output.topojson" format=topojson`
    ].join(' '),
    {
      'input.geojson': params.collection
    }
  )
  return JSON.parse(result['output.topojson'])
}

type ArrayObject<T> = Record<string, T | number> & {
  length: number
}

function toArrayObject<T>(array: readonly T[]): ArrayObject<T> {
  return array.reduce(
    (object, value, index) => ({ ...object, [`${index}`]: value }),
    { length: array.length }
  )
}

export type PackedGeometry =
  | {
      type: 'Polygon'
      coordinates: ArrayObject<Buffer>
    }
  | {
      type: 'MultiPolygon'
      coordinates: ArrayObject<ArrayObject<Buffer>>
    }

function packGeometry(geometry: Polygon | MultiPolygon): PackedGeometry {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: toArrayObject(
        geometry.coordinates.flatMap(coordinates =>
          Buffer.from(new Float64Array(coordinates.flat()).buffer)
        )
      )
    }
  }
  return {
    type: 'MultiPolygon',
    coordinates: toArrayObject(
      geometry.coordinates.map(coordinates =>
        toArrayObject(
          coordinates.flatMap(coordinates =>
            Buffer.from(new Float64Array(coordinates.flat()).buffer)
          )
        )
      )
    )
  }
}

async function uploadFeatures(params: {
  topology: Topology
  collection: CollectionReference
}): Promise<void> {
  const features = feature(
    params.topology,
    params.topology.objects.root
  ).features

  const writer = params.collection.firestore.bulkWriter()
  for (const feature of features) {
    invariant(feature.properties.S_NAME != null)
    invariant(
      feature.geometry.type === 'Polygon' ||
        feature.geometry.type === 'MultiPolygon'
    )
    const longitude = feature.properties.X_CODE
    const latitude = feature.properties.Y_CODE
    const id = [feature.properties.KEY_CODE, feature.properties.KIGO_E]
      .filter(isNotNullish)
      .join(':')
    const doc = params.collection.doc(id)
    void writer.create(doc, {
      // Notice the order is [latitude, longitude].
      geohash: geohashForLocation([latitude, longitude]),
      longitude,
      latitude,
      address1: `${feature.properties.CITY_NAME}${feature.properties.S_NAME}`,
      address2: `${feature.properties.PREF_NAME}${feature.properties.CITY_NAME}${feature.properties.S_NAME}`,
      properties: feature.properties,
      geometry: packGeometry(feature.geometry),
      bbox: turf.bbox(feature)
    })
  }
  await writer.close()
}

export async function main(): Promise<void> {
  if (
    process.env.GOOGLE_CLOUD_PROJECT == null ||
    process.env.GOOGLE_CLOUD_PROJECT === ''
  ) {
    throw new Error('Missing environment variable: GOOGLE_CLOUD_PROJECT')
  }
  const prefectureCodes = [...Array(47)].map((_, index) =>
    `${index + 1}`.padStart(2, '0')
  )
  for (const prefectureCode of prefectureCodes) {
    // Get the data at:
    // https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=B002005212020&prefCode=01&coordsys=1&format=shape&datum=2000
    const source = path.resolve(
      `./data/estat/B002005212020/A002005212015DDSWC${prefectureCode}-JGD2011/h27ka${prefectureCode}`
    )
    const input = await readShapefile(`${source}.shp`, `${source}.dbf`, {
      encoding: 'sjis'
    })
    const geojson = await processGeoJSON(input)
    const topojson = await convertToTopoJSON({ collection: geojson })
    const firestore = new Firestore({
      projectId: process.env.GOOGLE_CLOUD_PROJECT
    })
    const collection = firestore.collection('api/estat/areas')
    await uploadFeatures({
      topology: topojson,
      collection
    })
    console.log(`Uploaded ${prefectureCode}`)
  }
  console.log('Done')
}
