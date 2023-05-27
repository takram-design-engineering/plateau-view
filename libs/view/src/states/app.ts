import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import { type CesiumRoot } from '@takram/plateau-cesium'

import { type EnvironmentType } from '../containers/Environments'
import { type TerrainType } from '../containers/Terrains'

export const cesiumAtom = atom<CesiumRoot | null>(null)
export const readyAtom = atom<boolean>(false)

export const showDeveloperPanelsAtom = atom(false)

export type ColorMode = 'light' | 'dark'

export const environmentTypeAtom = atomWithReset<EnvironmentType>('map')
export const terrainTypeAtom = atomWithReset<TerrainType>('plateau')
export const enableTerrainLightingAtom = atomWithReset(true)
export const debugSphericalHarmonicsAtom = atomWithReset(false)

export type PlateauDataSource = '2020' | '2022' | 'cms'

export const plateauDataSourceAtom = atomWithReset<PlateauDataSource>('2020')
export const showDataFormatsAtom = atomWithReset(false)
export const showAreaEntitiesAtom = atomWithReset(false)

export const showSelectionBoundingSphereAtom = atomWithReset(false)
