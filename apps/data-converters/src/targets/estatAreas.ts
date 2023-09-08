import path from 'path'
import { Firestore, type CollectionReference } from '@google-cloud/firestore'
import * as turf from '@turf/turf'
import { geohashForLocation } from 'geofire-common'
import { type FeatureCollection } from 'geojson'
import { mapValues } from 'lodash'
import { applyCommands } from 'mapshaper'
import moji from 'moji'
import { read as readShapefile } from 'shapefile'
import invariant from 'tiny-invariant'
import { feature } from 'topojson-client'
import type TopoJSON from 'topojson-specification'

import {
  packGeometry,
  type EstatAreaDocument,
  type EstatAreaDocumentProperties
} from '@takram/plateau-nest-estat-areas'
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
          typeof input.S_NAME !== 'string' ||
          // Filter garbages out.
          input.S_NAME === '\u2010' ||
          input.S_NAME.startsWith('（')
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

async function uploadFeatures(params: {
  topology: Topology
  collection: CollectionReference<EstatAreaDocument>
}): Promise<void> {
  const features = feature(
    params.topology,
    params.topology.objects.root
  ).features

  const writer = params.collection.firestore.bulkWriter()
  for (const feature of features) {
    const props = feature.properties
    invariant(props.S_NAME != null)
    invariant(
      feature.geometry.type === 'Polygon' ||
        feature.geometry.type === 'MultiPolygon'
    )
    const id = props.KEY_CODE
    const longitude = props.X_CODE
    const latitude = props.Y_CODE
    const addressComponents = [
      props.PREF_NAME,
      props.GST_NAME,
      props.CSS_NAME,
      props.S_NAME
    ].filter(isNotNullish)
    invariant(addressComponents.length === 3 || addressComponents.length === 4)
    const doc = params.collection.doc(id)
    void writer
      .set(doc, {
        // Notice the order is [latitude, longitude].
        geohash: geohashForLocation([latitude, longitude]),
        longitude,
        latitude,
        ...(addressComponents.length === 3
          ? {
              shortAddress: `${props.GST_NAME ?? props.CSS_NAME}${props.S_NAME}`
            }
          : {
              shortAddress: `${props.CSS_NAME}${props.S_NAME}`,
              middleAddress: `${props.GST_NAME}${props.CSS_NAME}${props.S_NAME}`
            }),
        fullAddress: addressComponents.join(''),
        addressComponents,
        properties: props,
        geometry: packGeometry(feature.geometry),
        bbox: turf.bbox(feature)
      })
      .catch(error => {
        if (
          !(error instanceof Error) ||
          // Ignore documents of the same KEY_CODE with different KIGO_E.
          !error.message.startsWith('Document already exists')
        ) {
          throw error
        }
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
    const collection = firestore.collection(
      'api/estat/areas'
    ) as CollectionReference<EstatAreaDocument>
    await uploadFeatures({
      topology: topojson,
      collection
    })
    console.log(`Uploaded ${prefectureCode}`)
  }
  console.log('Done')
}
