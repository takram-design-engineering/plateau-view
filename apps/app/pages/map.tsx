import { Math as CesiumMath, Rectangle } from '@cesium/engine'
import { Box, Paper, Select, type SelectChangeEvent } from '@mui/material'
import maplibre from 'maplibre-gl'
import { type GetStaticProps, type NextPage } from 'next'
import { useCallback, useRef, useState } from 'react'
import {
  Map,
  type MapProps,
  type MapRef,
  type ViewStateChangeEvent
} from 'react-map-gl'
import invariant from 'tiny-invariant'

import { Canvas, type CesiumRoot } from '@takram/plateau-cesium'
import { VectorMapImageryLayer } from '@takram/plateau-datasets'

import 'maplibre-gl/dist/maplibre-gl.css'

import { SelectItem } from '@takram/plateau-ui-components'
import { darkStyle, lightStyle } from '@takram/plateau-vector-map-style'

const rectangleScratch = new Rectangle()

const Page: NextPage = () => {
  const [cesium, setCesium] = useState<CesiumRoot | null>(null)
  const mapRef = useRef<MapRef>(null)
  const camera = cesium?.camera

  const handleMove = useCallback(
    (event: ViewStateChangeEvent) => {
      const bounds = event.target.getBounds()
      rectangleScratch.north = CesiumMath.toRadians(bounds.getNorth())
      rectangleScratch.east = CesiumMath.toRadians(bounds.getEast())
      rectangleScratch.south = CesiumMath.toRadians(bounds.getSouth())
      rectangleScratch.west = CesiumMath.toRadians(bounds.getWest())
      camera?.setView({
        destination: rectangleScratch
      })
    },
    [camera]
  )

  // TODO: Sync changes in camera to map.
  // useEffect(() => {
  //   if (camera == null) {
  //     return
  //   }
  //   camera.percentageChanged = 0.001
  //   const removeListener = camera.changed.addEventListener(() => {
  //     if (mapRef.current == null || mapRef.current.isMoving()) {
  //       return
  //     }
  //     camera.computeViewRectangle(undefined, rectangleScratch)
  //     mapRef.current.fitBounds([
  //       CesiumMath.toDegrees(rectangleScratch.east),
  //       CesiumMath.toDegrees(rectangleScratch.north),
  //       CesiumMath.toDegrees(rectangleScratch.west),
  //       CesiumMath.toDegrees(rectangleScratch.south)
  //     ])
  //   })
  //   return () => {
  //     removeListener()
  //   }
  // }, [camera])

  const [path, setPath] = useState('light-map')
  const handleChange = useCallback((event: SelectChangeEvent) => {
    setPath(event.target.value)
  }, [])

  invariant(
    process.env.NEXT_PUBLIC_TILES_BASE_URL != null,
    'Missing environment variable: NEXT_PUBLIC_TILES_BASE_URL'
  )
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          flexBasis: 0,
          flexGrow: 1,
          flexShrink: 1
        }}
      >
        <Canvas
          cesiumRef={setCesium}
          msaaSamples={4}
          useBrowserRecommendedResolution={false}
          requestRenderMode
          maximumRenderTimeChange={1}
          sx={{
            position: 'absolute',
            inset: 0
          }}
        >
          <VectorMapImageryLayer
            baseUrl={process.env.NEXT_PUBLIC_TILES_BASE_URL}
            path={path}
          />
        </Canvas>
      </Box>
      <Box
        sx={{
          position: 'relative',
          flexBasis: 0,
          flexGrow: 1,
          flexShrink: 1
        }}
      >
        <Map
          ref={mapRef}
          mapLib={maplibre as any}
          mapStyle={
            {
              'light-map': lightStyle,
              'dark-map': darkStyle
            }[path] as MapProps['mapStyle']
          }
          minZoom={4}
          maxZoom={24}
          onMove={handleMove}
          initialViewState={{
            longitude: 139.765,
            latitude: 35.68,
            zoom: 12.5
          }}
          style={{
            position: 'absolute',
            inset: 0
          }}
        />
      </Box>
      <Paper sx={{ position: 'absolute', top: 0, left: 0, margin: 1 }}>
        <Select variant='filled' value={path} onChange={handleChange}>
          <SelectItem value='light-map'>Light</SelectItem>
          <SelectItem value='dark-map'>Dark</SelectItem>
        </Select>
      </Paper>
    </Box>
  )
}

export default Page

export const getStaticProps: GetStaticProps = () => {
  return process.env.NODE_ENV !== 'production'
    ? { props: {} }
    : { notFound: true }
}
