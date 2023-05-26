import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { WorldTerrain } from '@takram/plateau-cesium'
import {
  JapanSeaLevelEllipsoidTerrain,
  PlateauTerrain
} from '@takram/plateau-datasets'

import { terrainTypeAtom } from '../states/app'

export type TerrainType = 'ellipsoid' | 'plateau' | 'cesium-world'

export const Terrains: FC = () => {
  const terrainType = useAtomValue(terrainTypeAtom)
  switch (terrainType) {
    case 'ellipsoid':
      return <JapanSeaLevelEllipsoidTerrain />
    case 'plateau':
      return <PlateauTerrain requestVertexNormals />
    case 'cesium-world':
      return <WorldTerrain requestVertexNormals />
  }
}
