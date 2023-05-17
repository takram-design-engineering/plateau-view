import { Math as CesiumMath, Rectangle } from '@cesium/engine'
import { Box } from '@mui/material'
import maplibre from 'maplibre-gl'
import { type NextPage } from 'next'
import { useCallback, useRef, useState } from 'react'
import {
  Map,
  type MapProps,
  type MapRef,
  type ViewStateChangeEvent
} from 'react-map-gl'

import { Canvas, type CesiumRoot } from '@plateau/cesium'
import { VectorMapImageryLayer } from '@plateau/datasets'

import 'maplibre-gl/dist/maplibre-gl.css'

import invariant from 'tiny-invariant'

import mapStyle from '../public/assets/mapStyles/light.json'

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
          shouldAnimate
          maximumRenderTimeChange={1}
          sx={{
            position: 'absolute',
            inset: 0
          }}
        >
          <VectorMapImageryLayer
            baseUrl={process.env.NEXT_PUBLIC_TILES_BASE_URL}
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
          mapLib={maplibre}
          mapStyle={mapStyle as MapProps['mapStyle']}
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
    </Box>
  )
}

export default Page
