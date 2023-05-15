import * as turf from '@turf/turf'
import { readFile, writeFile } from 'fs/promises'
import { type FeatureCollection } from 'geojson'
import { maxBy, round } from 'lodash'
import { applyCommands } from 'mapshaper'
import { mkdirp } from 'mkdirp'
import path from 'path'
import polylabel from 'polylabel'
import { read as readShapefile } from 'shapefile'
import invariant from 'tiny-invariant'
import { merge, mergeArcs } from 'topojson-client'
import type TopoJSON from 'topojson-specification'

import { isNotNullish } from '@plateau/type-helpers'

import { type Municipalities, type Prefectures } from './areaCodes'

export interface AreaProperties {
  prefectureCode: string
  prefectureName: string
  municipalityCode?: string
  municipalityName?: string
  poleOfInaccessibility: [number, number]
  center: [number, number]
  radius: number
}

export type AreaGeometry =
  | TopoJSON.Polygon<AreaProperties>
  | TopoJSON.MultiPolygon<AreaProperties>

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
        if (typeof input.CITY !== 'string' || typeof input.PREF !== 'string') {
          return undefined
        }
        if (isNaN(+input.AREA)) {
          throw new Error('Cannot coarse area to number')
        }
        const properties: Partial<AreaProperties> = {
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

// Convert GeoJSON to TopoJSON, simplifying and merging geometries. Mapshaper is
// the best option to do so as far as I know.
async function convertToTopoJSON(params: {
  collection: FeatureCollection
  municipalities: Municipalities
  prefectureCode: string
  prefectureName: string
  interval?: number
}): Promise<TopoJSON.Topology> {
  const {
    collection,
    prefectureCode,
    prefectureName,
    municipalities,
    interval = 50
  } = params

  const result = await applyCommands(
    [
      '-i input.geojson name=root encoding=utf-8 snap',
      // Apply visvalingam simplification of the specified interval in meters.
      `-simplify interval=${interval}`,
      // Merge geometries of the same municipality code, copying properties of
      // the first geometry.
      '-dissolve fields=municipalityCode copy-fields=municipalityName,prefectureCode,prefectureName sum-fields=area',
      // Remove useless geometries.
      '-clean',
      `-o "output.topojson" format=topojson`
    ].join(' '),
    {
      'input.geojson': collection
    }
  )
  const topology: TopoJSON.Topology<{
    root: {
      type: 'GeometryCollection'
      geometries: AreaGeometry[]
    }
  }> = JSON.parse(result['output.topojson'])

  // Add geometries of designated cities and special wards.
  const municipalitiesToMerge = Object.entries(municipalities)
    .filter(([code]) => code.startsWith(prefectureCode))
    .filter((pair): pair is [string, [string, string[]]] =>
      Array.isArray(pair[1][1])
    )
  const mergedGeometries = municipalitiesToMerge.map(
    ([municipalityCode, [municipalityName, childCodes]]): AreaGeometry => {
      const geometry = mergeArcs(
        topology,
        childCodes
          .map(code =>
            topology.objects.root.geometries.find(
              geometry => geometry.properties?.municipalityCode === code
            )
          )
          .filter(isNotNullish)
      )
      geometry.properties = {
        municipalityCode,
        municipalityName,
        prefectureCode,
        prefectureName
      }
      return geometry as AreaGeometry
    }
  )

  // Add prefecture geometry
  const prefectureGeometry = mergeArcs(
    topology,
    topology.objects.root.geometries
  )
  prefectureGeometry.properties = {
    prefectureCode,
    prefectureName
  }
  topology.objects.root.geometries.push(...mergedGeometries)
  topology.objects.root.geometries.push(prefectureGeometry as AreaGeometry)

  const cesium = await import('@cesium/engine')
  const {
    BoundingSphere,
    Cartesian3,
    Cartographic,
    Ellipsoid,
    Math: CesiumMath
  } = cesium
  const boundingSphereScratch = new BoundingSphere()
  const cartesianScratch = new Cartesian3()
  const cartographicScratch = new Cartographic()

  // TODO: We can't import @plateau/datasets right now.
  // See libs/datasets/src/JapanSeaLevelEllipsoid.ts
  const a = 6378137
  const f = 1 / 298.257222101
  const b = (1 - f) * a
  const k = 36.7071
  const ellipsoid = new Ellipsoid(a + k, a + k, b + k)

  // Compute and store bounding sphere of the geometries.
  for (const geometryArcs of topology.objects.root.geometries) {
    let boundingSphere: InstanceType<typeof BoundingSphere> | undefined
    const geometry = merge(topology, [geometryArcs])
    geometry.coordinates.forEach(coordinates => {
      coordinates.forEach(coordinates => {
        coordinates.forEach(([x, y]) => {
          Cartesian3.fromDegrees(x, y, 0, ellipsoid, cartesianScratch)
          BoundingSphere.fromPoints([cartesianScratch], boundingSphereScratch)
          if (boundingSphere == null) {
            boundingSphere = new BoundingSphere()
            boundingSphereScratch.clone(boundingSphere)
          } else {
            BoundingSphere.fromBoundingSpheres(
              [boundingSphere, boundingSphereScratch],
              boundingSphere
            )
          }
        })
      })
    })
    invariant(boundingSphere != null)
    invariant(geometryArcs.properties != null)

    const maxPolygonCoordinates = maxBy(geometry.coordinates, coordinates =>
      turf.area(turf.polygon(coordinates))
    )
    invariant(maxPolygonCoordinates != null)
    const poleOfInaccessibility = polylabel(maxPolygonCoordinates, 1.0)
    geometryArcs.properties.poleOfInaccessibility = [
      round(poleOfInaccessibility[0], 6),
      round(poleOfInaccessibility[1], 6)
    ]

    const center = Cartographic.fromCartesian(
      boundingSphere.center,
      ellipsoid,
      cartographicScratch
    )
    geometryArcs.properties.center = [
      round(CesiumMath.toDegrees(center.longitude), 6),
      round(CesiumMath.toDegrees(center.latitude), 6)
    ]
    geometryArcs.properties.radius = round(boundingSphere.radius, 3)
  }

  return topology
}

export async function main(): Promise<void> {
  const { prefectures, municipalities } = JSON.parse(
    await readFile(path.resolve('./data/areaCodes.json'), 'utf-8')
  ) as {
    prefectures: Prefectures
    municipalities: Municipalities
  }

  await mkdirp(path.resolve('./data/areaPolygons'))
  for (const [prefectureCode, prefectureName] of Object.entries(prefectures)) {
    // Get the data at:
    // https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521&toukeiYear=2020&serveyId=B002005212020&prefCode=01&coordsys=1&format=shape&datum=2000
    const source = path.resolve(
      `./data/estat/A002005212015DDSWC${prefectureCode}-JGD2011/h27ka${prefectureCode}`
    )
    const input = await readShapefile(`${source}.shp`, `${source}.dbf`, {
      encoding: 'sjis'
    })
    const geojson = await processGeoJSON(input)
    const topojson = await convertToTopoJSON({
      collection: geojson,
      municipalities,
      prefectureCode,
      prefectureName
    })
    await writeFile(
      path.resolve('./data/areaPolygons', `${prefectureCode}.topojson`),
      JSON.stringify(topojson)
    )
    console.log(`Saved ${prefectureCode}.topojson`)
  }
  console.log('Done')
}
