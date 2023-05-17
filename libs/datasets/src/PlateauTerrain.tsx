import { CesiumTerrainProvider, IonResource } from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { useCesium, useSuspendInstance } from '@plateau/cesium'

export interface PlateauTerrainProps {
  requestVertexNormals?: boolean
  requestWaterMask?: boolean
}

export const PlateauTerrain: FC<PlateauTerrainProps> = ({
  requestVertexNormals,
  requestWaterMask
}) => {
  const terrainProvider = useSuspendInstance({
    owner: PlateauTerrain,
    keys: [requestVertexNormals, requestWaterMask],
    create: async () =>
      await CesiumTerrainProvider.fromUrl(
        // https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/terrain/plateau-terrain-streaming.md
        IonResource.fromAssetId(770371, {
          accessToken: process.env.NEXT_PUBLIC_PLATEAU_TERRAIN_ACCESS_TOKEN
        }),
        {
          requestVertexNormals,
          requestWaterMask
        }
      )
  })

  const cesium = useCesium()
  useEffect(() => {
    const prevTerrainProvider = cesium.terrainProvider
    cesium.terrainProvider = terrainProvider
    return () => {
      if (!cesium.isDestroyed()) {
        cesium.terrainProvider = prevTerrainProvider
      }
    }
  }, [terrainProvider, cesium])

  return null
}
