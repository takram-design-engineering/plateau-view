import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import { WorldTerrain } from '@plateau/cesium'
import {
  JapanSeaLevelEllipsoidTerrain,
  PlateauTerrain
} from '@plateau/datasets'

import { enableTerrainLightingAtom, terrainTypeAtom } from '../states/app'

export type TerrainType = 'ellipsoid' | 'plateau' | 'cesium-world'

export const Terrains: FC = () => {
  const terrainType = useAtomValue(terrainTypeAtom)
  const enableTerrainLighting = useAtomValue(enableTerrainLightingAtom)
  switch (terrainType) {
    case 'ellipsoid':
      return <JapanSeaLevelEllipsoidTerrain />
    case 'plateau':
      return <PlateauTerrain requestVertexNormals={enableTerrainLighting} />
    case 'cesium-world':
      return <WorldTerrain requestVertexNormals={enableTerrainLighting} />
  }
}
