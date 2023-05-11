import { type FC } from 'react'

const crossOrigin =
  process.env.NODE_ENV !== 'production' ? 'anonymous' : undefined

// prettier-ignore
export const PreloadCesium: FC = () => (
  // TODO: List up files dynamically.
  <>
    <link rel='preload' as='fetch' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/approximateTerrainHeights.json`} />
    <link rel='preload' as='fetch' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/IAU2006_XYS/IAU2006_XYS_17.json`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_px.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_py.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_my.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg`} />
    <link rel='preload' as='image' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Assets/Textures/moonSmall.jpg`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/AttributeCompression-f9f6c717.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/AxisAlignedBoundingBox-31fadcf0.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/cesiumWorkerBootstrapper.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Check-6ede7e26.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/combine-d9581036.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/ComponentDatatype-cf1fa08e.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/createTaskProcessorWorker.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/createVerticesFromHeightmap.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/createVerticesFromQuantizedTerrainMesh.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/defaultValue-fe22d8c0.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/EllipsoidTangentPlane-46d4d9c2.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/IndexDatatype-2643aa47.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/IntersectionTests-88c49b2e.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Math-0a2ac845.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Matrix2-e1298525.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Matrix3-41c58dde.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/OrientedBoundingBox-2dd47921.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Plane-4c3d403b.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/RuntimeError-ef395448.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/TerrainEncoding-51b8b33b.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/transferTypedArrayTest.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/Transforms-bc45e707.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/WebGLConstants-0b1ce7ba.js`} />
    <link rel='preload' as='script' crossOrigin={crossOrigin} href={`${process.env.NEXT_PUBLIC_CESIUM_BASE_URL}/Workers/WebMercatorProjection-13ed1a6e.js`} />
    <link rel='preload' as='fetch' crossOrigin='anonymous' href={`https://api.cesium.com/v1/assets/770371/endpoint?access_token=${process.env.NEXT_PUBLIC_PLATEAU_TERRAIN_ACCESS_TOKEN}`} />
  </>
)
