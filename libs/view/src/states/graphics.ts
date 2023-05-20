import { atom, type SetStateAction } from 'jotai'
import { atomWithReset, type RESET } from 'jotai/utils'

import { AmbientOcclusionOutputType } from '@takram/plateau-cesium-hbao'

export type AntialiasType = 'none' | 'fxaa' | 'msaa2x' | 'msaa4x' | 'msaa8x'

export const nativeResolutionEnabledAtom = atomWithReset(false)
export const explicitRenderingEnabledAtom = atomWithReset(true)
export const antialiasTypeAtom = atomWithReset<AntialiasType>('msaa4x')

export const shadowMapEnabledAtom = atomWithReset(true)
export const shadowMapSizeAtom = atomWithReset(4096)
export const shadowMapSoftShadowsAtom = atomWithReset(true)

export const ambientOcclusionEnabledAtom = atomWithReset(true)
export const ambientOcclusionIntensityAtom = atomWithReset(150)
export const ambientOcclusionMaxRadiusAtom = atomWithReset(40)
export const ambientOcclusionDirectionsAtom = atomWithReset(4)
export const ambientOcclusionStepsAtom = atomWithReset(8)

const ambientOcclusionTextureScalePrimitiveAtom = atomWithReset(0.5)
export const ambientOcclusionTextureScaleAtom = atom(
  get =>
    get(nativeResolutionEnabledAtom)
      ? get(ambientOcclusionTextureScalePrimitiveAtom)
      : 1,
  (get, set, value: SetStateAction<number> | typeof RESET) => {
    set(ambientOcclusionTextureScalePrimitiveAtom, value)
  }
)

const ambientOcclusionDenoisePrimitiveAtom = atomWithReset(true)
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
  atomWithReset(true)
export const ambientOcclusionOutputTypeAtom =
  atomWithReset<AmbientOcclusionOutputType | null>(null)
