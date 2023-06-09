import { isBoolean, isNumber } from 'class-validator'
import { atom, type SetStateAction } from 'jotai'
import { atomWithReset, type RESET } from 'jotai/utils'

import { AmbientOcclusionOutputType } from '@takram/plateau-cesium-hbao'
import { atomWithStorageValidation } from '@takram/plateau-shared-states'

export type AntialiasType = 'none' | 'fxaa' | 'msaa2x' | 'msaa4x' | 'msaa8x'

export function isAntialiasType(value: unknown): value is AntialiasType {
  return (
    value === 'none' ||
    value === 'fxaa' ||
    value === 'msaa2x' ||
    value === 'msaa4x' ||
    value === 'msaa8x'
  )
}

export const nativeResolutionEnabledAtom = atomWithStorageValidation({
  key: 'nativeResolutionEnabled',
  initialValue: false,
  validate: isBoolean
})

export const explicitRenderingEnabledAtom = atomWithReset(true)

export const antialiasTypeAtom = atomWithStorageValidation<AntialiasType>({
  key: 'antialiasType',
  initialValue: 'msaa4x',
  validate: isAntialiasType
})

export const shadowMapEnabledAtom = atomWithStorageValidation({
  key: 'shadowMapEnabled',
  initialValue: true,
  validate: isBoolean
})
export const shadowMapSizeAtom = atomWithStorageValidation({
  key: 'shadowMapSize',
  initialValue: 4096,
  validate: (value): value is number =>
    value === 1024 || value === 2048 || value === 4096
})
export const shadowMapSoftShadowsAtom = atomWithStorageValidation({
  key: 'shadowMapSoftShadows',
  initialValue: true,
  validate: isBoolean
})

export const ambientOcclusionEnabledAtom = atomWithStorageValidation({
  key: 'ambientOcclusionEnabled',
  initialValue: true,
  validate: isBoolean
})
export const ambientOcclusionIntensityAtom = atomWithStorageValidation({
  key: 'ambientOcclusionIntensity',
  initialValue: 100,
  validate: isNumber
})
export const ambientOcclusionMaxRadiusAtom = atomWithStorageValidation({
  key: 'ambientOcclusionMaxRadius',
  initialValue: 40,
  validate: isNumber
})
export const ambientOcclusionBiasAtom = atomWithStorageValidation({
  key: 'ambientOcclusionBias',
  initialValue: 0.1,
  validate: isNumber
})
export const ambientOcclusionDirectionsAtom = atomWithStorageValidation({
  key: 'ambientOcclusionDirections',
  initialValue: 4,
  validate: isNumber
})
export const ambientOcclusionStepsAtom = atomWithStorageValidation({
  key: 'ambientOcclusionSteps',
  initialValue: 8,
  validate: isNumber
})

const ambientOcclusionTextureScalePrimitiveAtom = atomWithStorageValidation({
  key: 'ambientOcclusionTextureScale',
  initialValue: 0.5,
  validate: isNumber
})
export const ambientOcclusionTextureScaleAtom = atom(
  get =>
    get(nativeResolutionEnabledAtom)
      ? get(ambientOcclusionTextureScalePrimitiveAtom)
      : 1,
  (get, set, value: SetStateAction<number> | typeof RESET) => {
    set(ambientOcclusionTextureScalePrimitiveAtom, value)
  }
)

const ambientOcclusionDenoisePrimitiveAtom = atomWithStorageValidation({
  key: 'ambientOcclusionDenoise',
  initialValue: true,
  validate: isBoolean
})
export const ambientOcclusionDenoiseAtom = atom(
  get => get(ambientOcclusionDenoisePrimitiveAtom),
  (get, set, value: SetStateAction<boolean> | typeof RESET) => {
    set(ambientOcclusionDenoisePrimitiveAtom, value)
    if (!get(ambientOcclusionDenoisePrimitiveAtom)) {
      set(ambientOcclusionOutputTypeAtom, value =>
        value === AmbientOcclusionOutputType.Weight ? null : value
      )
    }
  }
)

export const ambientOcclusionAccurateNormalReconstructionAtom =
  atomWithStorageValidation({
    key: 'ambientOcclusionAccurateNormalReconstruction',
    initialValue: true,
    validate: isBoolean
  })
export const ambientOcclusionOutputTypeAtom =
  atomWithReset<AmbientOcclusionOutputType | null>(null)

export const ambientOcclusionBlackPointAtom = atomWithReset(0.05)
export const ambientOcclusionWhitePointAtom = atomWithReset(0.9)
export const ambientOcclusionGammaAtom = atomWithReset(2.5)
