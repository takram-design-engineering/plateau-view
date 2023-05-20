import { EllipsoidTerrainProvider } from '@cesium/engine'
import { useEffect, type FC } from 'react'

import { useCesium } from '@takram/plateau-cesium'
import { useConstant } from '@takram/plateau-react-helpers'

import { JapanSeaLevelEllipsoid } from './JapanSeaLevelEllipsoid'

export const JapanSeaLevelEllipsoidTerrain: FC = () => {
  const terrainProvider = useConstant(
    () =>
      new EllipsoidTerrainProvider({
        ellipsoid: JapanSeaLevelEllipsoid
      })
  )

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
