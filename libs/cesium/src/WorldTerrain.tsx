import { createWorldTerrain } from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { useCesium } from './useCesium'

export interface WorldTerrainProps {
  requestVertexNormals?: boolean
  requestWaterMask?: boolean
}

export const WorldTerrain: FC<WorldTerrainProps> = ({
  requestVertexNormals,
  requestWaterMask
}) => {
  const cesium = useCesium()
  useEffect(() => {
    cesium.terrainProvider = createWorldTerrain({
      requestVertexNormals,
      requestWaterMask
    })
  }, [requestVertexNormals, requestWaterMask, cesium])

  return null
}
