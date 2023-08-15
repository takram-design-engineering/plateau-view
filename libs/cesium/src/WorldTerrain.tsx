import { createWorldTerrainAsync } from '@cesium/engine'
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
  const scene = useCesium(({ scene }) => scene)
  useEffect(() => {
    let canceled = false
    ;(async () => {
      const terrainProvider = await createWorldTerrainAsync({
        requestVertexNormals,
        requestWaterMask
      })
      if (canceled) {
        return
      }
      scene.terrainProvider = terrainProvider
    })().catch(error => {
      console.error(error)
    })
    return () => {
      canceled = true
    }
  }, [requestVertexNormals, requestWaterMask, scene])

  return null
}
