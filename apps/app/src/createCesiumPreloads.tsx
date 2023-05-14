import { Storage } from '@google-cloud/storage'
import { parseISO } from 'date-fns'
import { readdir } from 'fs/promises'
import { minimatch } from 'minimatch'
import { createRequire } from 'node:module'
import path from 'path'

import { isNotFalse } from '@plateau/type-helpers'

const assets = [
  { as: 'fetch', file: 'approximateTerrainHeights.json' },
  { as: 'fetch', file: 'IAU2006_XYS/IAU2006_XYS_17.json' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_px.jpg' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_mx.jpg' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_py.jpg' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_my.jpg' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_pz.jpg' },
  { as: 'image', file: 'Textures/SkyBox/tycho2t3_80_mz.jpg' },
  { as: 'image', file: 'Textures/moonSmall.jpg' }
]

// List up worker files fetched on load.
const workers = [
  'AttributeCompression-*.js',
  'AxisAlignedBoundingBox-*.js',
  'cesiumWorkerBootstrapper.js',
  'Check-*.js',
  'combine-*.js',
  'ComponentDatatype-*.js',
  'createTaskProcessorWorker.js',
  'createVerticesFromHeightmap.js',
  'createVerticesFromQuantizedTerrainMesh.js',
  'defaultValue-*.js',
  'EllipsoidTangentPlane-*.js',
  'IndexDatatype-*.js',
  'IntersectionTests-*.js',
  'Math-*.js',
  'Matrix2-*.js',
  'Matrix3-*.js',
  'OrientedBoundingBox-*.js',
  'Plane-*.js',
  'RuntimeError-*.js',
  'TerrainEncoding-*.js',
  'transferTypedArrayTest.js',
  'Transforms-*.js',
  'WebGLConstants-*.js',
  'WebMercatorProjection-*.js'
]

export async function createCesiumPreloads(): Promise<JSX.Element[]> {
  let workerFiles: string[]
  if (process.env.NODE_ENV === 'production') {
    if (process.env.CESIUM_ROOT == null) {
      throw new Error('Missing environment variables: CESIUM_ROOT')
    }
    const url = new URL(process.env.CESIUM_ROOT)
    const storage = new Storage()
    const bucket = storage.bucket(url.host)
    const [files] = await bucket.getFiles({
      prefix: `${url.pathname.slice(1)}/Worker`
    })
    workerFiles = files
      .sort(
        ({ metadata: a }, { metadata: b }) =>
          +parseISO(b.updated) - +parseISO(a.updated)
      )
      .map(file => path.basename(file.name))
  } else {
    const require = createRequire(import.meta.url)
    workerFiles = await readdir(
      path.resolve(
        path.dirname(require.resolve('@cesium/engine')),
        'Build/Workers'
      )
    )
  }
  return [
    ...assets.map(({ as, file }, index) => (
      <link
        key={`cesium-asset:${index}`}
        rel='preload'
        as={as}
        crossOrigin='anonymous'
        href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/${file}`}
      />
    )),
    ...workers
      .map((pattern, index) => {
        const file = workerFiles.find(file =>
          minimatch(file, pattern, { matchBase: true })
        )
        return (
          file != null && (
            <link
              key={`cesium-worker:${index}`}
              rel='preload'
              as='script'
              crossOrigin='anonymous'
              href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/${file}`}
            />
          )
        )
      })
      .filter(isNotFalse)
  ]
}