import { isNumber } from 'class-validator'
import { atom, type SetStateAction } from 'jotai'
import { atomWithReset, type RESET } from 'jotai/utils'

import { atomWithStorageValidation } from '@takram/plateau-shared-states'

import { type EnvironmentType } from '../containers/Environments'
import { type TerrainType } from '../containers/Terrains'
import { shadowMapEnabledAtom } from './graphics'

export const readyAtom = atom<boolean>(false)
export const showDeveloperPanelsAtom = atom(false)

const environmentTypePrimitiveAtom = atomWithReset<EnvironmentType>('map')
export const environmentTypeAtom = atom(
  get => get(environmentTypePrimitiveAtom),
  (get, set, value: SetStateAction<EnvironmentType> | typeof RESET) => {
    set(environmentTypePrimitiveAtom, value)
    if (value === 'google-photorealistic') {
      set(shadowMapEnabledAtom, false)
    }
  }
)
export const terrainTypeAtom = atomWithReset<TerrainType>('plateau')
export const enableTerrainLightingAtom = atomWithReset(true)
export const terrainElevationHeightRangeAtom = atomWithReset<[number, number]>([
  0, 1000
])
export const debugSphericalHarmonicsAtom = atomWithReset(false)
export const showShadowMapDepthAtom = atomWithReset(false)
export const showShadowMapCascadeColorsAtom = atomWithReset(false)

export const showDataFormatsAtom = atomWithReset(false)
export const showAreaEntitiesAtom = atomWithReset(false)

export const showSelectionBoundingSphereAtom = atomWithReset(false)

export const enableKeyboardCameraControlAtom = atomWithReset(false)

export const inspectorWidthAtom = atomWithStorageValidation({
  key: 'inspectorWidth',
  initialValue: 360,
  validate: isNumber
})
