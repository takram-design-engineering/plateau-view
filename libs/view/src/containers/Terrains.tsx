import { useAtomValue } from 'jotai'
import { type FC } from 'react'

import {
  JapanSeaLevelEllipsoidTerrain,
  PlateauTerrain
} from '@plateau/datasets'

import { terrainTypeAtom } from '../states/app'

export type TerrainType = 'ellipsoid' | 'plateau'

export const Terrains: FC = () => {
  const terrainType = useAtomValue(terrainTypeAtom)
  switch (terrainType) {
    case 'ellipsoid':
      return <JapanSeaLevelEllipsoidTerrain />
    case 'plateau':
      return <PlateauTerrain />
  }
}
