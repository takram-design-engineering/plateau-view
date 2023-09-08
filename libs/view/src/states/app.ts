import { isNumber } from 'class-validator'
import { atom, type SetStateAction } from 'jotai'
import { atomWithReset, type RESET } from 'jotai/utils'

import { atomWithStorageValidation } from '@takram/plateau-shared-states'

import { type EnvironmentType } from '../containers/Environments'
import { type TerrainType } from '../containers/Terrains'
import { shadowMapEnabledAtom } from './graphics'

export const readyAtom = atom<boolean>(false)
export const hideAppOverlayAtom = atom(false)
export const showDeveloperPanelsAtom = atom(false)

export const viewportWidthAtom = atom<number | null>(null)
export const viewportHeightAtom = atom<number | null>(null)

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
export const terrainElevationHeightRangeAtom = atomWithReset([0, 4000])
export const logarithmicTerrainElevationAtom = atomWithReset(true)
export const showMapLabelAtom = atomWithReset(false)

export const debugSphericalHarmonicsAtom = atomWithReset(false)
export const showShadowMapDepthAtom = atomWithReset(false)
export const showShadowMapCascadeColorsAtom = atomWithReset(false)

export const showDataFormatsAtom = atomWithReset(false)
export const showAreaEntitiesAtom = atomWithReset(false)

export const showSelectionBoundingSphereAtom = atomWithReset(false)

export const enableKeyboardCameraControlAtom = atomWithReset(false)
export const autoRotateCameraAtom = atomWithReset(false)

export const inspectorWidthAtom = atomWithStorageValidation({
  key: 'inspectorWidth',
  initialValue: 320,
  validate: isNumber
})

export const pedestrianInspectorWidthAtom = atomWithStorageValidation({
  key: 'pedestrianInspectorWidth',
  initialValue: 540,
  validate: isNumber
})
