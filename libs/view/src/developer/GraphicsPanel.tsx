import { Divider, Stack } from '@mui/material'
import { atom, useAtomValue, type SetStateAction } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { type FC } from 'react'

import { AmbientOcclusionOutputType } from '@takram/plateau-cesium-hbao'
import { atomWithResettableAtoms } from '@takram/plateau-shared-states'
import {
  DeveloperPanel,
  ParameterList,
  SelectParameterItem,
  SliderParameterItem,
  SwitchParameterItem
} from '@takram/plateau-ui-components'

import { environmentTypeAtom } from '../states/app'
import {
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBiasAtom,
  ambientOcclusionBlackPointAtom,
  ambientOcclusionDenoiseAtom,
  ambientOcclusionDirectionsAtom,
  ambientOcclusionEnabledAtom,
  ambientOcclusionGammaAtom,
  ambientOcclusionIntensityAtom,
  ambientOcclusionMaxRadiusAtom,
  ambientOcclusionOutputTypeAtom,
  ambientOcclusionStepsAtom,
  ambientOcclusionTextureScaleAtom,
  ambientOcclusionWhitePointAtom,
  antialiasTypeAtom,
  explicitRenderingEnabledAtom,
  nativeResolutionEnabledAtom,
  shadowMapEnabledAtom,
  shadowMapSizeAtom,
  shadowMapSoftShadowsAtom
} from '../states/graphics'

const ambientOcclusionReduceScaleAtom = atom(
  get => get(ambientOcclusionTextureScaleAtom) < 1,
  (get, set, value: SetStateAction<boolean>) => {
    set(
      ambientOcclusionTextureScaleAtom,
      (
        typeof value === 'function'
          ? value(get(ambientOcclusionReduceScaleAtom))
          : value
      )
        ? 0.5
        : 1
    )
  }
)

const resetAtom = atomWithResettableAtoms([
  ambientOcclusionAccurateNormalReconstructionAtom,
  ambientOcclusionBiasAtom,
  ambientOcclusionBlackPointAtom,
  ambientOcclusionDenoiseAtom,
  ambientOcclusionDirectionsAtom,
  ambientOcclusionEnabledAtom,
  ambientOcclusionGammaAtom,
  ambientOcclusionIntensityAtom,
  ambientOcclusionMaxRadiusAtom,
  ambientOcclusionOutputTypeAtom,
  ambientOcclusionStepsAtom,
  ambientOcclusionTextureScaleAtom,
  ambientOcclusionWhitePointAtom,
  antialiasTypeAtom,
  explicitRenderingEnabledAtom,
  nativeResolutionEnabledAtom,
  shadowMapEnabledAtom,
  shadowMapSizeAtom,
  shadowMapSoftShadowsAtom
])

export const GraphicsPanel: FC = () => {
  const nativeResolutionEnabled = useAtomValue(nativeResolutionEnabledAtom)
  const shadowMapEnabled = useAtomValue(shadowMapEnabledAtom)
  const ambientOcclusionEnabled = useAtomValue(ambientOcclusionEnabledAtom)
  const ambientOcclusionDenoise = useAtomValue(ambientOcclusionDenoiseAtom)
  const environmentType = useAtomValue(environmentTypeAtom)

  const handleReset = useResetAtom(resetAtom)

  return (
    <DeveloperPanel title='Graphics' onReset={handleReset}>
      <Stack spacing={1}>
        <ParameterList>
          <SwitchParameterItem
            label='Native Resolution'
            atom={nativeResolutionEnabledAtom}
          />
          <SwitchParameterItem
            label='Explicit Rendering'
            atom={explicitRenderingEnabledAtom}
          />
          <SelectParameterItem
            label='Antialias'
            atom={antialiasTypeAtom}
            items={[
              ['none', 'None'],
              ['fxaa', 'FXAA'],
              ['msaa2x', 'MSAA 2x'],
              ['msaa4x', 'MSAA 4x'],
              ['msaa8x', 'MSAA 8x']
            ]}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            label='Shadow Map'
            disabled={environmentType === 'google-photorealistic'}
            atom={shadowMapEnabledAtom}
          />
          <SelectParameterItem
            label='Resolution'
            disabled={!shadowMapEnabled}
            atom={shadowMapSizeAtom}
            items={[
              [1024, '1024 px'],
              [2048, '2048 px'],
              [4096, '4096 px']
            ]}
          />
          <SwitchParameterItem
            label='Soft Shadows'
            disabled={!shadowMapEnabled}
            atom={shadowMapSoftShadowsAtom}
          />
        </ParameterList>
        <Divider />
        <ParameterList>
          <SwitchParameterItem
            label='Ambient Occlusion'
            atom={ambientOcclusionEnabledAtom}
          />
          <SliderParameterItem
            label='Intensity'
            disabled={!ambientOcclusionEnabled}
            min={0}
            max={200}
            decimalPlaces={1}
            atom={ambientOcclusionIntensityAtom}
          />
          <SliderParameterItem
            label='Max Radius'
            step={1}
            min={1}
            max={100}
            decimalPlaces={0}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionMaxRadiusAtom}
          />
          <SliderParameterItem
            label='Bias'
            min={0}
            max={1}
            decimalPlaces={2}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionBiasAtom}
          />
          <SwitchParameterItem
            label='Reduce Resolution'
            disabled={!ambientOcclusionEnabled || !nativeResolutionEnabled}
            atom={ambientOcclusionReduceScaleAtom}
          />
          <SwitchParameterItem
            label='Accurate Normal Reconstruction'
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionAccurateNormalReconstructionAtom}
          />
          <SwitchParameterItem
            label='Denoise'
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionDenoiseAtom}
          />
          <SelectParameterItem
            label='Output Type'
            displayEmpty
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionOutputTypeAtom}
            items={[
              [null, 'Final'],
              [AmbientOcclusionOutputType.Occlusion, 'AO Only'],
              [AmbientOcclusionOutputType.Normal, 'Normal'],
              [AmbientOcclusionOutputType.Depth, 'Depth'],
              [
                AmbientOcclusionOutputType.Weight,
                'Bilateral Weight',
                { disabled: !ambientOcclusionDenoise }
              ],
              [AmbientOcclusionOutputType.Shade, 'Shade']
            ]}
          />
          <SliderParameterItem
            label='Number of Sample Directions'
            disabled={!ambientOcclusionEnabled}
            step={1}
            min={1}
            max={16}
            decimalPlaces={0}
            atom={ambientOcclusionDirectionsAtom}
          />
          <SliderParameterItem
            label='Number of Sample Steps'
            step={1}
            min={1}
            max={16}
            decimalPlaces={0}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionStepsAtom}
          />
          <SliderParameterItem
            label='Shade Black Point'
            min={0}
            max={1}
            decimalPlaces={2}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionBlackPointAtom}
          />
          <SliderParameterItem
            label='Shade White Point'
            min={0}
            max={1}
            decimalPlaces={2}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionWhitePointAtom}
          />
          <SliderParameterItem
            label='Shade Gamma'
            min={1}
            max={3}
            decimalPlaces={2}
            disabled={!ambientOcclusionEnabled}
            atom={ambientOcclusionGammaAtom}
          />
        </ParameterList>
      </Stack>
    </DeveloperPanel>
  )
}
