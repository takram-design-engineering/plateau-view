import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import { type CesiumRoot } from '@plateau/cesium'
import { type Platform } from '@plateau/ui-components'

import { type EnvironmentType } from '../containers/Environments'
import { type TerrainType } from '../containers/Terrains'
import { type PlateauDataSource } from '../datasets/PlateauDataSource'

export const cesiumAtom = atom<CesiumRoot | null>(null)
export const readyAtom = atom<boolean>(false)
export const platformAtom = atom<Platform | null>(null)

export const showDeveloperPanelsAtom = atom(false)

export type ColorMode = 'light' | 'dark'

export const environmentTypeAtom = atomWithReset<EnvironmentType>('map')
export const terrainTypeAtom = atomWithReset<TerrainType>('plateau')
export const colorModeAtom = atomWithReset<ColorMode>('light')
export const enableTerrainLightingAtom = atomWithReset(false)
export const debugSphericalHarmonicsAtom = atomWithReset(false)

export const plateauDataSourceAtom = atomWithReset<PlateauDataSource>('2020')
export const showAreaEntitiesAtom = atomWithReset(false)

export const showSelectionBoundingSphereAtom = atomWithReset(false)
